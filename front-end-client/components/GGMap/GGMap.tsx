import { useRef, useState } from 'react';
import { Modal, Button, Group } from '@mantine/core';
import { GoogleMap, StreetViewPanorama, LoadScript, Marker } from '@react-google-maps/api';
import { IconMap2 } from '@tabler/icons';
import { useGGMapStyle } from './GGMap.style';

const containerStyle = {
  width: '100%',
  height: '40rem'
};

interface Props {
  lat: number;
  lng: number;
}

const GGMap = (props: Props) => {
  const center = {
    lat: props.lat,
    lng: props.lng
  };
  const googleMapsApiKey = 'AIzaSyDAWEb9MuB2YxHqHDUrqi_S4_tnLQskd0o';
  const [opened, setOpened] = useState(false);
  const { classes } = useGGMapStyle();

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} size="xl">
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={500}>
            <Marker position={center} />
            <StreetViewPanorama />
          </GoogleMap>
        </LoadScript>
      </Modal>

      <Group position="center">
        <IconMap2 className={classes['icon']} onClick={() => setOpened(true)}></IconMap2>
      </Group>
    </>
  );
};

export default GGMap;
