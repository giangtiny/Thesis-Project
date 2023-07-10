import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Container, Tabs, Space, Text, Group, Button, Loader, Center, Stack } from "@mantine/core";

import Layout from "@/components/Layout";
import TreBookingForm from "@/components/TreBookingForm";
import TableRoom from "@/components/TableRoom";
import { openModal } from "@mantine/modals";
import RoomForm from "@/components/RoomForm";
import RoomPrice from "@/components/RoomPrice";
import { getCurrentHotel, updateHotel } from "@/api/hotel";
import { HotelFormProvider, useHotelForm } from "@/context/hotel";
import { HotelProps } from "@/utils/types";
import { getAvailableRooms } from "@/api/room";
import Stats from "@/components/Stats";
import Comment from "@/components/Comment";
import Amenity from "@/components/Amenity";
export default function HotelDetailPage() {
  const [activeTab, setActiveTab] = useState<string | null>("first");
  const [loading, setLoading] = useState<boolean>(true);
  const [initialForm, setInitialForm] = useState<HotelProps>();
  const location = useLocation();
  const { id } = useParams();
  const { action }: { action: string } = location.state ? location.state : "";
  const isCreating: boolean = action === "new";
  const isUpdating: boolean = action === "update";

  const form = useHotelForm({
    initialValues: {
      id: "",
      ownerID: "",
      name: "",
      address: "",
      images: [],
      images360: [],
      amenities: [],
      rooms: [],
      description: "",
      totalRoom: 0,
      dayOrderMaxRoom: 5,
      promotionDescription: "",
      deposit: 50,
      lat: 0,
      lng: 0,
      needToContact: false,
      contactInfor: "",
    },
    validate: {
      name: (value: string) => (value.length < 1 ? 'Không được để trống tên' : null),
      description: (value: string) => (value.length < 1 ? 'Không được để trống mô tả' : null),
      address: (value: string) => (value.length < 1 ? 'Không được để trống địa chỉ' : null),
      contactInfor: (value: string, values) =>
        value.length < 1 && values.needToContact
          ? "Vui lòng nhập thông tin liên hệ"
          : null,
    },
  });

  useEffect(() => {
    if (!isCreating) {
      getCurrentHotel(id ? id : "").then((hotel) => {
        form.setValues({ ...hotel, deposit: hotel.deposit * 100 });
        setInitialForm(hotel);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleUpdateHotel = () => {
    if (form.validate().hasErrors) {
      return;
    }
    setLoading(true);
    updateHotel(form.values.id, {
      name: form.values.name,
      address: form.values.address,
      description: form.values.description,
      dayOrderMaxRoom: Number(form.values.dayOrderMaxRoom),
      deposit: Number(form.values.deposit),
      lat: form.values.lat,
      lng: form.values.lng,
      amenities: form.values.amenities,
      images: form.values.images,
      images360: form.values.images360,
      promotionDescription: form.values.promotionDescription,
      needToContact: form.values.needToContact,
      contactInfor: form.values.contactInfor,
    }).then(async () => {
      const hotel = await getCurrentHotel(id ? id : "");
      form.setValues({ ...hotel, deposit: hotel.deposit * 100 });
      setLoading(false);
    });
  };
  return (
    <Container fluid>
      <HotelFormProvider form={form}>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Space h="sm" />
          <Tabs color="teal" defaultValue="first" value={activeTab} onTabChange={setActiveTab} keepMounted={false}>
            <Tabs.List style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "white" }}>
              <Group style={{ width: "70%" }} spacing={0}>
                <Tabs.Tab value="first">
                  <Text size="md" color={activeTab === "first" ? undefined : "dimmed"}>
                    {isCreating ? "Thêm mới" : "Chỉnh sửa"}
                  </Text>
                </Tabs.Tab>
                {!isCreating ? (
                  <>
                    <Tabs.Tab value="second">
                      <Text size="md" color={activeTab === "second" ? undefined : "dimmed"}>
                        Quản lý phòng
                      </Text>
                    </Tabs.Tab>
                    <Tabs.Tab value="third">
                      <Text size="md" color={activeTab === "third" ? undefined : "dimmed"}>
                        Quản lý giá
                      </Text>
                    </Tabs.Tab>

                    <Tabs.Tab value="fourth">
                      <Text size="md" color={activeTab === "fourth" ? undefined : "dimmed"}>
                        Quản lý bình luận
                      </Text>
                    </Tabs.Tab>

                    <Tabs.Tab value="fifth">
                      <Text size="md" color={activeTab === "fifth" ? undefined : "dimmed"}>
                        Quản lý tiện ích
                      </Text>
                    </Tabs.Tab>
                    <Tabs.Tab value="sixth">
                      <Text size="md" color={activeTab === "sixth" ? undefined : "dimmed"}>
                        Thống kê
                      </Text>
                    </Tabs.Tab>
                  </>
                ) : null}
              </Group>
              {form.isDirty() && isUpdating && activeTab === "first" ? (
                <Group style={{ width: "30%" }} position="right" pr={20}>
                  <Button color="teal" variant="outline" onClick={() => form.setValues({ ...initialForm })}>
                    Hủy thay đổi
                  </Button>
                  <Button color="teal" type="submit" onClick={handleUpdateHotel}>
                    Lưu thay đổi
                  </Button>
                </Group>
              ) : null}
            </Tabs.List>

            <Tabs.Panel value="first" pt="xs">
              {loading ? (
                <Center style={{ height: "80vh", width: "80vw" }}>
                  <Stack>
                    <Loader />
                    <Text align="center">Đang tải...</Text>
                  </Stack>
                </Center>
              ) : (
                <TreBookingForm assetType="hotel" />
              )}
            </Tabs.Panel>

            <Tabs.Panel value="second" pt="xs">
              <TableRoom hotelId={id ? id : ""} />
            </Tabs.Panel>

            <Tabs.Panel value="third" pt="xs">
              <RoomPrice objectId={id ? id : ""} assetType="hotel" />
            </Tabs.Panel>
            <Tabs.Panel value="fourth" pt="xs">
              <Comment objectId={id ? id : ""} ownerID={form.values.ownerID} assetType="hotel" />
            </Tabs.Panel>
            <Tabs.Panel value="fifth" pt="xs">
              <Amenity objectId={id ? id : ""} assetType="hotel" action="update" />
            </Tabs.Panel>
            <Tabs.Panel value="sixth" pt="xs">
              <Stats objectId={id ? id : ""} assetType="hotel" />
            </Tabs.Panel>
          </Tabs>
          <Space h="sm" />
        </form>
      </HotelFormProvider>
    </Container>
  );
}
