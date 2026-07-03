import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const MapPicker = ({ location, setLocation }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
  });

  if (!isLoaded) return <>Loading Map...</>;

  return (
    <GoogleMap
      zoom={15}
      center={
        location || {
          lat: 18.5204,
          lng: 73.8567,
        }
      }
      mapContainerStyle={{
        height: "300px",
        width: "100%",
      }}
      onClick={(e) => {
        setLocation({
          lat: e.latLng.lat(),

          lng: e.latLng.lng(),
        });
      }}
    >
      {location && <Marker position={location} />}
    </GoogleMap>
  );
};

export default MapPicker;
