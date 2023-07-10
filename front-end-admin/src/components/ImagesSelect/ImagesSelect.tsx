import { SetStateAction, useEffect, useState } from "react";
import { BackgroundImage, Box, Grid, Checkbox, Button, Group, Image, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store";
import { imagesHotelActions } from "@/redux/slices";
import { selectImagesHotelSelect } from "@/redux/selectors";
import { useImagesSelectStyles } from "./ImagesSelect.style";
import { closeAllModals, openConfirmModal } from "@mantine/modals";
import { deleteImages, deleteImages360, getCurrentHotel } from "@/api/hotel";
import { HotelProps, VillaProps } from "@/utils/types";
import { ASSET_TEXT } from "@/constants/asset";
import { deleteImages360Villa, deleteImagesVilla, getCurrentVilla } from "@/api/villa";
import { deleteImages360Townhouse, deleteImagesTownhouse, getCurrentTownhouse } from "@/api/townhouse";

const CustomImage = ({ image }: { image: string }) => {
  const [checked, setChecked] = useState(false);
  const dispatch = useAppDispatch();
  const { setImagesHotelSelect } = imagesHotelActions;
  const imagesSelected = useSelector(selectImagesHotelSelect);
  const { classes, cx } = useImagesSelectStyles();

  useEffect(() => {
    setChecked(() => imagesSelected.includes(image));
  }, [imagesSelected]);

  return (
    <Image
      src={image}
      onClick={() => {
        dispatch(setImagesHotelSelect(image));
      }}
      classNames={{
        imageWrapper: cx(classes.image, { [classes.imageSelect]: checked }),
      }}
    />
  );
};

export default function ImagesSelect({
  assetType,
  id,
  images,
  setTempImages,
  form,
  isImage360,
}: {
  assetType: string;
  id: string;
  images: string[];
  setTempImages?: React.Dispatch<SetStateAction<string[]>>;
  form?: UseFormReturnType<HotelProps> | UseFormReturnType<VillaProps>;
  isImage360?: boolean;
}) {
  const imagesSelect = useSelector(selectImagesHotelSelect);
  const dispatch = useAppDispatch();
  const { clearImagesHotelSelect } = imagesHotelActions;

  const handleCancel = () => {
    closeAllModals();
    dispatch(clearImagesHotelSelect());
  };

  const handleDelete = () => {
    const tempImages = images.filter((item) => !imagesSelect.includes(item));
    if (!setTempImages) {
      if (assetType === ASSET_TEXT.HOTEL) {
        if (isImage360) {
          deleteImages360(id, imagesSelect).then(() => {
            getCurrentHotel(id).then((data) => {
              form && form.setValues({ ...data });
            });
          });
        } else {
          deleteImages(id, imagesSelect).then(() => {
            getCurrentHotel(id).then((data) => {
              form && form.setValues({ ...data });
            });
          });
        }
      }
      if (assetType === ASSET_TEXT.VILLA) {
        if (isImage360) {
          deleteImages360Villa(id, imagesSelect).then(() => {
            getCurrentVilla(id).then((data) => {
              form && form.setValues({ ...data });
            });
          });
        } else {
          deleteImagesVilla(id, imagesSelect).then(() => {
            getCurrentVilla(id).then((data) => {
              form && form.setValues({ ...data });
            });
          });
        }
      }
      if (assetType === ASSET_TEXT.TOWN_HOUSE) {
        if (isImage360) {
          deleteImages360Townhouse(id, imagesSelect).then(() => {
            getCurrentTownhouse(id).then((data) => {
              form && form.setValues({ ...data });
            });
          });
        } else {
          deleteImagesTownhouse(id, imagesSelect).then(() => {
            getCurrentTownhouse(id).then((data) => {
              form && form.setValues({ ...data });
            });
          });
        }
      }
    } else {
      setTempImages(tempImages);
    }
    dispatch(clearImagesHotelSelect());
    closeAllModals();
  };

  const openDeleteModal = () =>
    openConfirmModal({
      title: "Xóa ảnh đã chọn",
      centered: true,
      children: <Text size="sm">Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa những ảnh này?</Text>,
      labels: { confirm: "Xác nhận xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () => handleDelete(),
    });

  return (
    <Grid>
      {images.map((image, index) => {
        return (
          <Grid.Col key={index} span={4}>
            <CustomImage image={image} />
          </Grid.Col>
        );
      })}
      <Grid.Col span={12}>
        <Group position="right">
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button color="red" onClick={openDeleteModal} disabled={imagesSelect.length < 1}>
            Xóa
          </Button>
        </Group>
      </Grid.Col>
    </Grid>
  );
}
