import { Button, Container, Flex, Input, Skeleton, Text } from "@mantine/core";
import React, { useState, useEffect, useRef } from "react";
import MapPicker from "react-google-map-picker";
const DefaultZoom = 16;
const GOOGLE_MAPS_APIKEY = "AIzaSyDAWEb9MuB2YxHqHDUrqi_S4_tnLQskd0o";

interface Props {
  form: any;
  address: string;
}
interface Location {
  lat: number;
  lng: number;
}
const defaultLocaton = {
  lat: 10.330355506229294,
  lng: 107.0881436586687,
};
const PickLocation = (props: Props) => {
  const [location, setLocation] = useState<Location>(defaultLocaton);

  const [zoom, setZoom] = useState(DefaultZoom);
  const [loading, setLoading] = useState(true);
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (!firstUpdate.current) {
      getCoordinates();
    } else {
      firstUpdate.current = false;
    }
  }, [props.address]);

  useEffect(() => {
    if (props.form.values.lat && props.form.values.lng) {
      setLocation({
        lat: props.form.values.lat,
        lng: props.form.values.lng,
      });
    } else {
      getCoordinates();
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getCoordinates = async () => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${props.address || "23 Thùy Vân Vũng Tàu"}&key=${GOOGLE_MAPS_APIKEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.results && data.results[0] && data.results[0].geometry) {
          setLocation(data.results[0].geometry.location);
          props.form.setFieldValue("lat", data.results[0].geometry.location.lat);
          props.form.setFieldValue("lng", data.results[0].geometry.location.lng);
        } else {
          setLocation(defaultLocaton);
          props.form.setFieldValue("lat", defaultLocaton.lat);
          props.form.setFieldValue("lng", defaultLocaton.lng);
        }
      });
  };
  function handleChangeLocation(lat: any, lng: any) {
    setLocation({ lat: lat, lng: lng });
    props.form.setFieldValue("lat", lat);
    props.form.setFieldValue("lng", lng);
  }

  function handleChangeZoom(newZoom: any) {
    setZoom(newZoom);
  }

  function handleResetLocation() {
    getCoordinates();
    setZoom(DefaultZoom);
  }

  return loading ? (
    <Skeleton height={"35rem"} width={"80%"} />
  ) : (
    <>
      <Text fw={700}>Chọn vị trí trên bản đồ</Text>
      <Flex>
        <MapPicker defaultLocation={location} zoom={zoom} style={{ height: "35rem" }} onChangeLocation={handleChangeLocation} onChangeZoom={handleChangeZoom} apiKey={GOOGLE_MAPS_APIKEY} />
        <Container>
          <Button onClick={handleResetLocation}>Đặt lại vị trí theo địa chỉ</Button>

          <Input.Wrapper label="Latitute" maw={320} mx="auto">
            <Input<any> size="lg" type="text" value={location.lat} disabled />
          </Input.Wrapper>

          <Input.Wrapper label="Longitute" maw={320} mx="auto">
            <Input<any> size="lg" type="text" value={location.lng} disabled />
          </Input.Wrapper>
        </Container>
      </Flex>
    </>
  );
};

export default PickLocation;
