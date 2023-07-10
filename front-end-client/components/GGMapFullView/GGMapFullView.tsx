import { useRef, useState } from 'react';
import { Button, Group } from '@mantine/core';
import { GoogleMap, StreetViewPanorama, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '40rem'
};

interface Props {
  lat: number;
  lng: number;
}
const GGMapFullView = (props: Props) => {
  const center = {
    lat: props.lat,
    lng: props.lng
  };
  const googleMapsApiKey = 'AIzaSyDAWEb9MuB2YxHqHDUrqi_S4_tnLQskd0o';

  return (
    <>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
          <Marker position={center} />
          <StreetViewPanorama />
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default GGMapFullView;
