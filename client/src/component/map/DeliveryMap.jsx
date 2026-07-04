import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

const DeliveryMap = ({ customerLocation }) => {
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setDriverLocation({
        lat: pos.coords.latitude,

        lng: pos.coords.longitude,
      });
    });
  }, []);

  return (
    <MapContainer
      center={[customerLocation.lat, customerLocation.lng]}
      zoom={14}
      style={{
        height: "350px",
        width: "100%",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Customer Marker */}

      <Marker position={[customerLocation.lat, customerLocation.lng]}>
        <Popup>Customer Location</Popup>
      </Marker>

      {/* Delivery Boy */}

      {driverLocation && (
        <Marker position={[driverLocation.lat, driverLocation.lng]}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default DeliveryMap;
