import React, { useEffect, useState } from "react";
import { Paper, TextInput, Textarea, Stack, Text, Stepper, Group, Button, Space, Center, Loader, NumberInput, Flex, Checkbox } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { useLocation, useNavigate } from "react-router-dom";
import { ASSET_NAME, ASSET_NUMBER, ASSET_TEXT } from "@/constants/asset";
import { FormProps } from "@/utils/types";
import ImageDropzone from "@/components/ImageDropzone";
import TableRoom from "@/components/TableRoom";
import { baseFormInputProps, percentInputProps, villaFormInputProps, hotelFormInputProps, townhouseFormInputProps, contactInfoProps } from "@/constants/forms";
import RoomForm from "@/components/RoomForm";
import { createNewHotel } from "@/api/hotel";
import { createNewVilla } from "@/api/villa";
import { createNewTownhouse } from "@/api/townhouse";
import { useHotelFormContext } from "@/context/hotel";
import { useVillaFormContext } from "@/context/villa";
import { useTownhouseFormContext } from "@/context/townhouse";
import { HOTEL, VILLA, TOWNHOUSE } from "@/constants/routes";
import LoadingComponent from "@/components/LoadingComponent";
import PickLocation from "../PickLocation";
import Image360Dropzone from "../Image360Dropzone";
import Amenity from "../Amenity";

export default function TreBookingForm({ assetType }: FormProps) {
  const location = useLocation();
  // const form = useHotelFormContext();
  const form = assetType === ASSET_TEXT.HOTEL ? useHotelFormContext() : assetType === ASSET_TEXT.VILLA ? useVillaFormContext() : useTownhouseFormContext();
  const navigate = useNavigate();
  const { action }: { action: string } = location.state ? location.state : "";
  const isCreating: boolean = action === "new";
  const isUpdating: boolean = action === "update";

  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);

  const nextStep = async () => {
    if (form.validate().hasErrors) {
      return;
    }
    console.log("form values", form.values);
    console.log("object", active, assetType);
    switch (active) {
      case 0:
        setLoading(true);
        let createdSuccessFully: boolean = false;
        if (assetType === ASSET_TEXT.HOTEL) {
          createdSuccessFully = await createNewHotel({
            name: form.values.name,
            address: form.values.address,
            description: form.values.description,
            dayOrderMaxRoom: Number(form.values.dayOrderMaxRoom) || 100,
            promotionDescription: form.values.promotionDescription || "",
            deposit: Number(form.values.deposit) || 0,
            lat: form.values.lat,
            lng: form.values.lng,
            needToContact: form.values.needToContact,
            contactInfor: form.values.contactInfor,
          })
            .then((data) => {
              console.log("data res", data);
              form.setValues(data);
              return true;
            })
            .catch((err) => {
              console.log(err);
              return false;
            });
        }
        if (assetType === ASSET_TEXT.VILLA) {
          createdSuccessFully = await createNewVilla({
            name: form.values.name,
            images: [],
            address: form.values.address,
            description: form.values.description,
            price: Number(form.values.price),
            numberOfCustomer: form.values.numberOfCustomer,
            type: ASSET_NUMBER[assetType],
            deposit: Number(form.values.deposit) || 0,
            lat: form.values.lat,
            lng: form.values.lng,
            needToContact: form.values.needToContact,
            contactInfor: form.values.contactInfor,
          })
            .then((data) => {
              form.setValues(data);
              return true;
            })
            .catch((err) => {
              console.log(err);
              return false;
            });
        }
        if (assetType === ASSET_TEXT.TOWN_HOUSE) {
          createdSuccessFully = await createNewTownhouse({
            name: form.values.name,
            images: [],
            address: form.values.address,
            description: form.values.description,
            price: Number(form.values.price),
            numberOfCustomer: form.values.numberOfCustomer,
            deposit: Number(form.values.deposit) || 0,
            type: ASSET_NUMBER[assetType],
            lat: form.values.lat,
            lng: form.values.lng,
            needToContact: form.values.needToContact,
            contactInfor: form.values.contactInfor,
          })
            .then((data) => {
              form.setValues(data);
              return true;
            })
            .catch((err) => {
              console.log(err);
              return false;
            });
        }
        setLoading(false);
        return setActive((current) => (current < 5 && createdSuccessFully ? current + 1 : current));
      case 1:
        return setActive((current) => (current < 5 ? current + 1 : current));
      case 2:
        return setActive((current) => (current < 5 ? current + 1 : current));
      case 3:
        if (assetType === ASSET_TEXT.VILLA) {
          return navigate(VILLA);
        }
        if (assetType === ASSET_TEXT.TOWN_HOUSE) {
          return navigate(TOWNHOUSE);
        }
        return setActive((current) => (current < 5 ? current + 1 : current));
      case 4:
        if (assetType === ASSET_TEXT.HOTEL) {
          return navigate(HOTEL);
        }
        if (assetType === ASSET_TEXT.VILLA) {
          return navigate(VILLA);
        }
        return navigate(TOWNHOUSE);
    }
    return setActive((current) => (current < 5 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => {
      if (current === 0) {
        form.reset();
      }
      return current > 0 ? current - 1 : current;
    });

  const renderBaseForm = () => {
    return (
      <>
        {baseFormInputProps.map((props) => (
            //@ts-ignore
          <TextInput {...props} {...form.getInputProps(props.inputProps)} key={props.label} />
        ))}
        <Textarea
          label="Mô tả"
          //@ts-ignore
          {...form.getInputProps("description")}
          placeholder={`Nhập mô tả`}
          maxRows={15}
          autosize
        />
        {/* <NumberInput
          {...form.getInputProps('dayOrderMaxRoom')}
          label="Số phòng tối đa một đơn theo ngày"
          placeholder="Nhập số phòng tối đa"
        /> */}
        <NumberInput
          //@ts-ignore
          {...form.getInputProps("deposit")}
          label="Tỉ lệ tiền cọc (%)"
          placeholder="Nhập tỉ lệ tiền cọc theo phần trăm"
          icon="%"
          {...percentInputProps}
        />
      </>
    );
  };

  const renderHotelForm = () =>
    assetType === ASSET_TEXT.HOTEL
      ? hotelFormInputProps.map((props) => (
          //@ts-ignore
          <TextInput {...props} {...form.getInputProps(props.inputProps)} key={props.label} />
        ))
      : null;

  const renderVillaForm = () =>
    assetType === ASSET_TEXT.VILLA
      ? villaFormInputProps.map((props) => (
          //@ts-ignore
          <NumberInput {...props} min={0} {...form.getInputProps(props.inputProps)} key={props.label} />
        ))
      : null;

  const renderTownhouseForm = () =>
    assetType === ASSET_TEXT.TOWN_HOUSE
      ? townhouseFormInputProps.map((props) => (
          //@ts-ignore
          <NumberInput {...props} min={0} {...form.getInputProps(props.inputProps)} key={props.label} />
        ))
      : null;

  const renderPickLocation = () => {
    return <PickLocation form={form} address={form.values.address}></PickLocation>;
  };
  const renderContactInfo = () => (
    <>
      <Flex wrap="wrap" align="center" gap="md">
        <Checkbox
          //@ts-ignore
          checked={form.values[contactInfoProps[0].inputProps]}
          onChange={(e) => {
            console.log("object form ", form, e);
            //@ts-ignore
            form.setFieldValue(
              contactInfoProps[0].inputProps,
              e.target.checked
            );
            console.log(e.target.checked, "form changed", form);
          }}
          {...contactInfoProps[0]}
          label={contactInfoProps[0].label}
        />
        {
          //@ts-ignore
          form.values[contactInfoProps[0].inputProps] && (
            <TextInput
              style={{ flex: "1" }}
              {...contactInfoProps[1]}
              //@ts-ignore
              {...form.getInputProps(contactInfoProps[1].inputProps)}
            />
          )
        }
      </Flex>
    </>
  );
  // contactInfoProps.map((props) => (
  //     //@ts-ignore
  //     <NumberInput {...props} min={0} {...form.getInputProps(props.inputProps)} key={props.label} />
  //   ))
  return (
    <Paper p="md">
      {!isCreating ? (
        <Stack>
          {renderBaseForm()}
          {renderHotelForm()}
          {renderVillaForm()}
          {renderTownhouseForm()}
          {renderContactInfo()}
          {renderPickLocation()}
          <ImageDropzone assetType={assetType} assetId={form.values.id} />
          <Image360Dropzone assetType={assetType} assetId={form.values.id}></Image360Dropzone>
        </Stack>
      ) : (
        <>
          <Stepper active={active} onStepClick={setActive} breakpoint="sm" color="teal">
            <Stepper.Step label="Nhập thông tin cơ bản" description={`Thông tin cơ bản cho ${ASSET_NAME[assetType]}`} allowStepSelect={active > 0}>
              <Stack>
                {loading ? (
                  <LoadingComponent />
                ) : (
                  <>
                    {renderBaseForm()}
                    {renderHotelForm()}
                    {renderVillaForm()}
                    {renderTownhouseForm()}
                    {renderContactInfo()}
                    {renderPickLocation()}
                  </>
                )}
              </Stack>
            </Stepper.Step>
            <Stepper.Step label="Tải ảnh lên" description={`Tải ảnh minh họa cho ${ASSET_NAME[assetType]}`} allowStepSelect={active > 1}>
              <ImageDropzone assetType={assetType} assetId={form.values.id} />
            </Stepper.Step>
            <Stepper.Step label="Tải ảnh 360 lên" description={`Tải ảnh 360 minh họa cho ${ASSET_NAME[assetType]}`} allowStepSelect={active > 2}>
              <Image360Dropzone assetType={assetType} assetId={form.values.id}></Image360Dropzone>
            </Stepper.Step>
            <Stepper.Step label="Thêm Tiện Ích" description={`Thêm tiện ích cho ${ASSET_NAME[assetType]}`} allowStepSelect={active > 2}>
              <Amenity assetType={assetType} objectId={form.values.id} action={"create"}></Amenity>
            </Stepper.Step>
            {assetType === "hotel" ? (
              <Stepper.Step label="Thêm phòng" description={`Thêm phòng cho ${ASSET_NAME[assetType]}`} allowStepSelect={active > 3}>
                <TableRoom hotelId={form.values.id} />
              </Stepper.Step>
            ) : null}
          </Stepper>

          <Group position="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              {active === 0 ? "Reset" : "Quay lại"}
            </Button>
            <Button onClick={nextStep} color="teal">
              Tiếp theo
            </Button>
          </Group>
        </>
      )}
    </Paper>
  );
}
