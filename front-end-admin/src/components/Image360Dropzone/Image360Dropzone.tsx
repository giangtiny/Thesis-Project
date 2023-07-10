import React, { useState, useEffect } from "react";
import { Button, Group, Stack, Text, Transition, LoadingOverlay } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto } from "@tabler/icons";
import { PhotoAlbum } from "react-photo-album";
import imagesModal from "@/utils/modals";
import { ASSET_TEXT } from "@/constants/asset";
import { getCurrentHotel, uploadImages360 } from "@/api/hotel";
import { useHotelFormContext } from "@/context/hotel";
import { useVillaFormContext } from "@/context/villa";
import { useTownhouseFormContext } from "@/context/townhouse";
import { AssetType } from "@/utils/types";
import { getCurrentVilla, uploadImages360Villa } from "@/api/villa";
import { getCurrentTownhouse, uploadImages360Townhouse } from "@/api/townhouse";

export default function Image360Dropzone({ assetType, assetId }: { assetType: "hotel" | "villa" | "town-house"; assetId: string }) {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [newImages360, setNewImages360] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const openRef = React.useRef<() => void>(null);
  const form = assetType === ASSET_TEXT.HOTEL ? useHotelFormContext() : assetType === ASSET_TEXT.VILLA ? useVillaFormContext() : useTownhouseFormContext();
  //@ts-ignore
  const images360 = form.getInputProps("images360").value;

  useEffect(() => {
    if (files.length > 0) {
      const tempImages = [...newImages360];
      files.forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        tempImages.unshift(imageUrl);
      });
      setNewImages360(tempImages);
    }
  }, [files]);

  const handleUpLoadImages360 = async () => {
    setLoading(true);
    if (assetType === ASSET_TEXT.HOTEL) {
      await uploadImages360(assetId, files)
        .then(async () => {
          const newFormValues = await getCurrentHotel(assetId);
          form.setValues({ ...newFormValues });
        })
        .catch((e) => {
          console.log(e);
        });
      setNewImages360([]);
      setLoading(false);
    }
    if (assetType === ASSET_TEXT.VILLA) {
      await uploadImages360Villa(assetId, files)
        .then(async () => {
          const newFormValues = await getCurrentVilla(assetId);
          form.setValues({ ...newFormValues });
        })
        .catch((e) => {
          console.log(e);
        });
      setNewImages360([]);
      setLoading(false);
    }
    if (assetType === ASSET_TEXT.TOWN_HOUSE) {
      await uploadImages360Townhouse(assetId, files)
        .then(async () => {
          const newFormValues = await getCurrentTownhouse(assetId);
          form.setValues({ ...newFormValues });
        })
        .catch((e) => {
          console.log(e);
        });
      setNewImages360([]);
      setLoading(false);
    }
  };

  return (
    <Stack>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Group position="apart">
        <Text size="sm">Thêm hình ảnh 360</Text>
        <Group>
          <Transition mounted={newImages360.length > 0} transition="slide-right" duration={400} timingFunction="ease">
            {(styles) => (
              <Group style={styles}>
                <Button color="teal" variant="subtle" onClick={() => setNewImages360([])}>
                  Hủy
                </Button>
                <Button leftIcon={<IconPhoto />} color="teal" onClick={handleUpLoadImages360}>
                  Upload ảnh 360
                </Button>
              </Group>
            )}
          </Transition>
          <Button leftIcon={<IconPhoto />} color="teal" variant="outline" onClick={() => openRef.current && openRef.current()}>
            Thêm ảnh 360
          </Button>
        </Group>
      </Group>
      <Dropzone openRef={openRef} onDrop={setFiles} accept={IMAGE_MIME_TYPE}>
        <Dropzone.Idle>
          <Text size="xl" align="center" color="dimmed">
            <IconPhoto size={50} stroke={1.5} />
          </Text>
        </Dropzone.Idle>
        <Stack>
          <Text size="xl" inline align="center">
            Thêm ảnh 360 bằng cách kéo file vào đây
          </Text>
          <Text size="sm" color="dimmed" inline mt={7} align="center">
            Có thể thêm nhiều hình ảnh 360
          </Text>
        </Stack>
      </Dropzone>
      {newImages360.length > 0 ? (
        <Stack>
          <Text size="sm">Xem trước</Text>
          <PhotoAlbum
            onClick={() => imagesModal(assetType, assetId, newImages360, setNewImages360, undefined, true)}
            layout="rows"
            photos={newImages360.map((image: string) => ({ src: image, width: 800, height: 600 }))}
          />
        </Stack>
      ) : null}
      {images360 && images360.length > 0 ? (
        <>
          <Text size="sm">Hình ảnh 360 hiện tại</Text>
          <PhotoAlbum
            onClick={() => imagesModal(assetType, assetId, images360, undefined, form, true)}
            layout="rows"
            photos={images360.map((image: string) => ({ src: image, width: 800, height: 600 }))}
          />
        </>
      ) : null}
    </Stack>
  );
}
