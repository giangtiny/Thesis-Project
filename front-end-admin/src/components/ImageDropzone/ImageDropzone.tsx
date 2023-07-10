import React, { useState, useEffect } from 'react';
import { Button, Group, Stack, Text, Transition, LoadingOverlay } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto } from '@tabler/icons';
import { PhotoAlbum } from 'react-photo-album';
import imagesModal from '@/utils/modals';
import { ASSET_TEXT } from '@/constants/asset';
import { getCurrentHotel, uploadImages } from '@/api/hotel';
import { useHotelFormContext } from '@/context/hotel';
import { useVillaFormContext } from '@/context/villa';
import { useTownhouseFormContext } from '@/context/townhouse';
import { AssetType } from '@/utils/types';
import { getCurrentVilla, uploadImagesVilla } from '@/api/villa';
import { getCurrentTownhouse, uploadImagesTownhouse } from '@/api/townhouse';

export default function ImageDropzone({ assetType, assetId }: { assetType: 'hotel' | 'villa' | 'town-house', assetId: string }) {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const openRef = React.useRef<() => void>(null);
  const form = assetType === ASSET_TEXT.HOTEL ? useHotelFormContext() : assetType === ASSET_TEXT.VILLA ? useVillaFormContext() : useTownhouseFormContext();
  //@ts-ignore
  const images = form.getInputProps('images').value;

  useEffect(() => {
    if (files.length > 0) {
      const tempImages = [...newImages];
      files.forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        tempImages.unshift(imageUrl);
      });
      setNewImages(tempImages);
    }
  }, [files]);

  const handleUpLoadImages = async () => {
    setLoading(true);
    if (assetType === ASSET_TEXT.HOTEL) {
      await uploadImages(assetId, files)
        .then(async () => {
          const newFormValues = await getCurrentHotel(assetId);
          form.setValues({ ...newFormValues });
        })
        .catch((e) => {
          console.log(e);
        });
      setNewImages([]);
      setLoading(false);
    }
    if (assetType === ASSET_TEXT.VILLA) {
      await uploadImagesVilla(assetId, files)
        .then(async () => {
          const newFormValues = await getCurrentVilla(assetId);
          form.setValues({ ...newFormValues });
        })
        .catch((e) => {
          console.log(e);
        });
      setNewImages([]);
      setLoading(false);
    }
    if (assetType === ASSET_TEXT.TOWN_HOUSE) {
      await uploadImagesTownhouse(assetId, files)
        .then(async () => {
          const newFormValues = await getCurrentTownhouse(assetId);
          form.setValues({ ...newFormValues });
        })
        .catch((e) => {
          console.log(e);
        });
      setNewImages([]);
      setLoading(false);
    }
  };

  return (
    <Stack>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Group position="apart">
        <Text size="sm">Thêm hình ảnh (kích thước tối thiểu 750x500)</Text>
        <Group>
          <Transition
            mounted={newImages.length > 0}
            transition="slide-right"
            duration={400}
            timingFunction="ease"
          >
            {(styles) => (
              <Group style={styles}>
                <Button color="teal" variant="subtle" onClick={() => setNewImages([])}>
                  Hủy
                </Button>
                <Button leftIcon={<IconPhoto />} color="teal" onClick={handleUpLoadImages}>
                  Upload ảnh
                </Button>
              </Group>
            )}
          </Transition>
          <Button
            leftIcon={<IconPhoto />}
            color="teal"
            variant="outline"
            onClick={() => openRef.current && openRef.current()}
          >
            Thêm ảnh
          </Button>
        </Group>
      </Group>
      <Dropzone
        openRef={openRef}
        onDrop={setFiles}
        maxSize={3 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
      >
        <Dropzone.Idle>
          <Text size="xl" align="center" color="dimmed">
            <IconPhoto size={50} stroke={1.5} />
          </Text>
        </Dropzone.Idle>
        <Stack>
          <Text size="xl" inline align="center">
            Thêm ảnh bằng cách kéo file vào đây
          </Text>
          <Text size="sm" color="dimmed" inline mt={7} align="center">
            Có thể thêm nhiều hình, mỗi hình không được quá 5mb
          </Text>
        </Stack>
      </Dropzone>
      {newImages.length > 0 ? (
        <Stack>
          <Text size="sm">Xem trước</Text>
          <PhotoAlbum
            onClick={() => imagesModal(assetType, assetId, newImages, setNewImages)}
            layout="rows"
            photos={newImages.map((image: string) => ({ src: image, width: 800, height: 600 }))}
          />
        </Stack>
      ) : null}
      {images && images.length > 0 ? (
        <>
          <Text size="sm">Hình ảnh hiện tại</Text>
          <PhotoAlbum
            onClick={() => imagesModal(assetType, assetId, images, undefined, form)}
            layout="rows"
            photos={images.map((image: string) => ({ src: image, width: 800, height: 600 }))}
          />
        </>
      ) : null}
    </Stack>
  );
}
