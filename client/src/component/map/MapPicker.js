import { useState, useMemo, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Box, Button, TextField } from "@mui/material";
import debounce from "lodash.debounce";
import "leaflet/dist/leaflet.css";

// Nominatim's usage policy allows max ~1 request/second across the WHOLE
// app. Every caller (reverse-geocode, suggestions, search button, current
// location) goes through this so we never trip 429 Too Many Requests,
// no matter how many places in the component fire a fetch at once.
let lastNominatimCallAt = 0;
const MIN_GAP_MS = 1100;

const rateLimitedFetch = async (url, options = {}) => {
  const now = Date.now();
  const wait = Math.max(0, lastNominatimCallAt + MIN_GAP_MS - now);

  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }

  lastNominatimCallAt = Date.now();

  const res = await fetch(url, options);

  if (res.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  if (!res.ok) {
    throw new Error(`HTTP_${res.status}`);
  }

  return res.json();
};

// Restrict every Nominatim call to India only.
const COUNTRY_CODES = "in";
// left(minLon),top(maxLat),right(maxLon),bottom(minLat) — covers all of India.
const INDIA_VIEWBOX = "68.1,37.6,97.4,6.5";

// Build a clean, precise address string from Nominatim's structured
// address object instead of the noisy full display_name.
const buildPreciseAddress = (data) => {
  const a = data?.address;
  if (!a) return data?.display_name ?? "";

  const parts = [
    a.house_number,
    a.road,
    a.suburb || a.neighbourhood,
    a.village || a.town || a.city,
    a.state,
    a.postcode,
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : data.display_name ?? "";
};

// Map Nominatim's address object onto AddressForm's field names.
// Note: Nominatim doesn't have a clean 1:1 for India's taluka/post-office
// admin levels, so this is best-effort (county ~ taluka, state_district ~
// district) — user can still correct manually if it's off.
const mapAddressToForm = (address) => {
  if (!address) return {};

  return {
    pincode: address.postcode || "",
    state: address.state || "",
    district: address.state_district || address.county || "",
    city:
      address.city || address.town || address.municipality || address.city_district || "",
    taluka: address.county || address.state_district || "",
    village: address.village || address.hamlet || "",
    houseNo: address.house_number || "",
    area: address.road || address.suburb || address.neighbourhood || "",
  };
};

const ChangeView = ({ location }) => {
  const map = useMap();

  if (location) {
    map.setView([location.lat, location.lng], 16);
  }

  return null;
};

const LocationMarker = ({ location, setLocation, getAddressFromLatLng }) => {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setLocation({ lat, lng });
      getAddressFromLatLng(lat, lng);
    },
  });

  return location ? <Marker position={[location.lat, location.lng]} /> : null;
};

const MapPicker = ({ location, setLocation, setForm }) => {
  const [search, setSearch] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Fill the parent AddressForm from a Nominatim address object. Only
  // overwrites fields that actually came back non-empty, so it never
  // blanks out something the user already typed manually.
  const fillFormFromAddress = (address) => {
    if (!setForm || !address) return;

    const mapped = mapAddressToForm(address);

    setForm((prev) => {
      const next = { ...prev };
      Object.entries(mapped).forEach(([key, value]) => {
        if (value) next[key] = value;
      });
      return next;
    });
  };

  // Wrapper ref so the debounced fn always reads the LATEST location
  // without needing to be recreated (recreating it was killing pending timers).
  const locationRef = useRef(location);
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  // Track request order so a slow, older response can never overwrite
  // a newer one (this was the actual "backspace shows stale suggestions" bug).
  const requestIdRef = useRef(0);

  // Cancel in-flight reverse-geocode / forward-search calls when a newer one starts.
  const reverseAbortRef = useRef(null);
  const searchAbortRef = useRef(null);

  const wrapperRef = useRef(null);

  const getAddressFromLatLng = async (lat, lng) => {
    reverseAbortRef.current?.abort();
    const controller = new AbortController();
    reverseAbortRef.current = controller;

    try {
      const data = await rateLimitedFetch(
        `https://nominatim.openstreetmap.org/reverse?format=json` +
          `&lat=${lat}&lon=${lng}` +
          `&zoom=18&addressdetails=1`,
        { signal: controller.signal },
      );
      setSelectedAddress(buildPreciseAddress(data));
      fillFormFromAddress(data.address);
      setErrorMsg("");
    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("Reverse geocode failed", err);
      setErrorMsg(
        err.message === "RATE_LIMITED"
          ? "Too many requests — thoda vel thaamb, punha try kar."
          : "Address fetch failed. Try again.",
      );
    }
  };

  const currentLocation = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) alert("Geolocation is not supported by this browser");
      return;
    }

    setLoading(true);
    setSuggestions([]);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });
        await getAddressFromLatLng(lat, lng);
        setLoading(false);
      },
      () => {
        setLoading(false);
        // Don't nag the user with an alert on the automatic mount-time
        // attempt — only complain when they explicitly tap "Current".
        if (!silent) alert("Allow location permission");
      },
    );
  };

  // Automatically grab the current location once when the component mounts,
  // so the map centers on the user (Maharashtra/India) without a click.
  useEffect(() => {
    currentLocation(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchAddress = async () => {
    const query = search.trim();
    if (!query) return;

    try {
      const data = await rateLimitedFetch(
        `https://nominatim.openstreetmap.org/search?format=json` +
          `&addressdetails=1` +
          `&countrycodes=${COUNTRY_CODES}` +
          `&viewbox=${INDIA_VIEWBOX}&bounded=1` +
          `&q=${encodeURIComponent(query)}`,
      );

      if (data.length > 0) {
        setLocation({ lat: Number(data[0].lat), lng: Number(data[0].lon) });
        setSelectedAddress(buildPreciseAddress(data[0]));
        fillFormFromAddress(data[0].address);
        setSuggestions([]);
        setErrorMsg("");
      } else {
        alert("Location not found in India");
      }
    } catch (err) {
      console.error("Search failed", err);
      setErrorMsg(
        err.message === "RATE_LIMITED"
          ? "Too many requests — thoda vel thaamb, punha try kar."
          : "Search failed. Try again.",
      );
    }
  };

  // Stable debounced function — created once, never recreated,
  // so no pending timer is ever silently dropped.
  const searchSuggestions = useMemo(
    () =>
      debounce(async (value) => {
        // Skip tiny queries entirely — "p", "pu" etc. burn through the
        // rate limit fast and rarely give useful suggestions anyway.
        if (!value || value.trim().length < 3) {
          setSuggestions([]);
          return;
        }

        const currentRequestId = ++requestIdRef.current;

        searchAbortRef.current?.abort();
        const controller = new AbortController();
        searchAbortRef.current = controller;

        const loc = locationRef.current;

        // Prefer a tight box around the user's current location (soft bias,
        // not bounded) so nearby results rank first; otherwise fall back to
        // the whole-India box so results never leak outside the country.
        let url =
          `https://nominatim.openstreetmap.org/search` +
          `?format=json&limit=5&addressdetails=1` +
          `&countrycodes=${COUNTRY_CODES}` +
          `&q=${encodeURIComponent(value)}`;

        if (loc) {
          url +=
            `&viewbox=${loc.lng - 0.3},${loc.lat + 0.3},` +
            `${loc.lng + 0.3},${loc.lat - 0.3}`;
        } else {
          url += `&viewbox=${INDIA_VIEWBOX}&bounded=1`;
        }

        try {
          const data = await rateLimitedFetch(url, { signal: controller.signal });

          // Ignore this response if a newer request has since started,
          // or if the input has been cleared in the meantime.
          if (currentRequestId !== requestIdRef.current) return;

          setSuggestions(data);
          setErrorMsg("");
        } catch (err) {
          if (err.name === "AbortError") return;
          if (currentRequestId !== requestIdRef.current) return;

          console.error("Suggestion fetch failed", err);
          setErrorMsg(
            err.message === "RATE_LIMITED"
              ? "Too many requests — thoda vel thaamb."
              : "",
          );
        }
      }, 500),
    [],
  );

  // Cancel pending debounce + in-flight requests on unmount.
  useEffect(() => {
    return () => {
      searchSuggestions.cancel();
      reverseAbortRef.current?.abort();
      searchAbortRef.current?.abort();
    };
  }, [searchSuggestions]);

  // Close suggestions when clicking outside the search box.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (value) => {
    setSearch(value);

    if (!value.trim()) {
      // Clear immediately instead of waiting for the debounce to fire —
      // this is what makes backspacing-to-empty feel instant and correct.
      searchSuggestions.cancel();
      requestIdRef.current += 1; // invalidate any in-flight response
      setSuggestions([]);
      return;
    }

    searchSuggestions(value);
  };

  return (
    <Box>
      <Box mb={2}>
        <Box
          display="flex"
          gap={1}
          sx={{ flexDirection: { xs: "column", sm: "row" } }}
        >
          <Box ref={wrapperRef} sx={{ position: "relative", flex: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search society, area, city..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchAddress();
              }}
            />

            {suggestions.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "45px",
                  left: 0,
                  right: 0,
                  bgcolor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 9999,
                  maxHeight: "220px",
                  overflowY: "auto",
                }}
              >
                {suggestions.map((item) => (
                  <Box
                    key={item.place_id}
                    onClick={() => {
                      setLocation({ lat: +item.lat, lng: +item.lon });
                      setSearch(item.display_name);
                      setSelectedAddress(buildPreciseAddress(item));
                      fillFormFromAddress(item.address);
                      searchSuggestions.cancel();
                      requestIdRef.current += 1;
                      setSuggestions([]);
                    }}
                    sx={{
                      p: 1.5,
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    📍 {item.display_name}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Button variant="contained" onClick={searchAddress}>
            Search
          </Button>

          <Button
            variant="outlined"
            onClick={() => currentLocation(false)}
            disabled={loading}
          >
            {loading ? "Finding..." : "Current"}
          </Button>
        </Box>

        {errorMsg && (
          <Box mt={0.5} sx={{ fontSize: "13px", color: "#c62828" }}>
            {errorMsg}
          </Box>
        )}
      </Box>

      <Box
        sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #ddd" }}
      >
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={location ? 16 : 5}
          style={{ height: "350px", width: "100%" }}
        >
          <ChangeView location={location} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker
            location={location}
            setLocation={setLocation}
            getAddressFromLatLng={getAddressFromLatLng}
          />
        </MapContainer>
      </Box>

      {selectedAddress && (
        <Box
          mt={2}
          p={2}
          sx={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#fafafa",
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          📍 {selectedAddress}
        </Box>
      )}
    </Box>
  );
};

export default MapPicker;