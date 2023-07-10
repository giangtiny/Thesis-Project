import { Text, Group, Grid, ActionIcon, Paper, TextInput, Button, Flex, Space, Box, Divider, Center, Modal, CloseButton } from "@mantine/core";
import * as icons from "@tabler/icons";
import amenities from "./amenities.json";
import { useEffect, useRef, useState } from "react";
import { addAmenityAPI, deleteAmenityAPI, getAmenityAPI } from "@/api/amenity";

interface AmenityProps {
  icon: string;
  description: string;
}

interface Props {
  objectId: string;
  assetType: string;
  action: string;
}

export default function Amenity(props: Props) {
  const [opened, setOpened] = useState(false);
  const [icon, setIcon] = useState<string>("IconPlus");
  const [dataAmenity, setDataAmenity] = useState<AmenityProps[]>([]);
  const [textDecription, setTextDecription] = useState<string>("");
  const IconChoose = icons[`${icon}` as keyof typeof icons];
  const ref = useRef<HTMLInputElement>(null);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    async function getAmenity() {
      if (props.action !== "update") {
      } else {
        await getAmenityAPI(props.objectId, props.assetType).then((data) => {
          console.log("data", data);
          setDataAmenity(data);
        });
      }
    }
    getAmenity();
  }, []);

  const handleAddNewAmenity = async () => {
    if (textDecription) {
      const newAmenity = {
        icon: icon,
        description: textDecription,
      };
      await addAmenityAPI(props.objectId, props.assetType, newAmenity.icon, newAmenity.description);
      setDataAmenity((prevDataAmenity) => [...prevDataAmenity, newAmenity]);
      setTextDecription("");
      if (ref.current) {
        ref.current.value = "";
      }
      setIcon("IconPlus");
    } else {
      setIsError(true);
    }
  };

  const handleDeteleAmenity = async (item: AmenityProps) => {
    await deleteAmenityAPI(props.objectId, props.assetType, item.icon, item.description);
    const newAmenity = dataAmenity.filter((amenity) => amenity.description !== item.description && amenity.icon !== item.icon);
    setDataAmenity(newAmenity);
  };

  return (
    <Paper p={"xl"} bg={"white"}>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Chọn biểu tượng cho tiện ích" size={"xl"}>
        <Grid>
          {amenities.map((key, index) => {
            const IconComponent = icons[key as keyof typeof icons];

            return (
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
                  borderRadius: theme.radius.md,
                  cursor: "pointer",
                  padding: theme.spacing.md,
                  border: "0.5px solid transparent",
                  "&:hover": {
                    border: "0.5px solid #000",
                    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
                  },
                })}
                key={index}
              >
                <IconComponent
                  style={{ cursor: "pointer" }}
                  size={"50"}
                  onClick={() => {
                    setIcon(key);
                    setOpened(false);
                    ref.current?.focus();
                  }}
                />
              </Box>
            );
          })}
        </Grid>
      </Modal>
      <Center style={{ flexDirection: "column" }}>
        <Text>Thêm Tiện Ích</Text>
        <Space h="xl" />
        <div>
          <Flex align="center">
            <Box>
              <ActionIcon variant="outline" color="dark" radius="xl" onClick={() => setOpened(true)}>
                <IconChoose />
              </ActionIcon>
            </Box>
            <Space w="sm" />
            <TextInput ref={ref} onChange={(e) => setTextDecription(e.currentTarget.value)} error={isError} />
            <Space w="sm" />
            <Button onClick={handleAddNewAmenity}>Thêm</Button>
          </Flex>
        </div>
      </Center>

      <Divider m={"xl"} />
      <Group ml={20}>
        {dataAmenity?.map((item, index) => {
          const IconComponent = icons[`${item.icon}` as keyof typeof icons];
          return (
            <Flex key={index} align="center">
              <Box>
                <ActionIcon variant="outline" color="gray" radius="xl">
                  <IconComponent />
                </ActionIcon>
              </Box>
              <Space w="sm" />
              <Text>{item.description}</Text>
              <CloseButton onClick={() => handleDeteleAmenity(item)}></CloseButton>
            </Flex>
          );
        })}
      </Group>
    </Paper>
  );
}
