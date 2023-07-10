import { Text, Stack } from "@mantine/core";
import { openModal } from "@mantine/modals";
import ImagesSelect from "@/components/ImagesSelect";
import { SetStateAction } from "react";
import { UseFormReturnType } from "@mantine/form";
import { HotelProps, VillaProps } from "@/utils/types";

export const imagesModal = (
  assetType: string,
  id: string,
  images: string[],
  setImages?: React.Dispatch<SetStateAction<string[]>>,
  form?: UseFormReturnType<HotelProps> | UseFormReturnType<VillaProps>,
  isImage360?: boolean
) => {
  return openModal({
    title: (
      <Stack>
        <Text fw={600} fz="lg">
          Hình ảnh
        </Text>
        <Text>Chọn hình ảnh để xóa bằng cách nhấn vào hình ảnh</Text>
      </Stack>
    ),
    children: <ImagesSelect assetType={assetType} id={id} images={images} setTempImages={setImages} form={form} isImage360={isImage360} />,
    size: "xl",
  });
};
