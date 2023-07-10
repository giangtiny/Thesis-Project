import { FileWithPath } from "@mantine/dropzone";
import { MantineTheme } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { api } from "../axios";
import { IconCheck, IconX } from "@tabler/icons";
import { styles } from "@/utils/toasts";
import { UseFormReturnType } from "@mantine/form";
import { TownhouseProps } from "@/utils/types";
import { toPercentage } from "@/utils/formats";

const townhouse = "townhouse/";

const imageRoute = "http://trebaybooking.com/static/images/";

export const getAllTownhouse = async () => {
  return api
    .get(townhouse + "all")
    .then((response) => {
      const data = response.data.map((item: any) => {
        return { ...item, id: item._id };
      });
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getCurrentTownhouse = async (id: string) => {
  return api
    .get(townhouse + id)
    .then((response) => {
      const { images, images360 } = response.data;
      images.forEach((image: string, index: number, images: string[]) => {
        images[index] = imageRoute + image;
      });
      images360?.forEach((image: string, index: number, images: string[]) => {
        images[index] = imageRoute + image;
      });
      return { ...response.data, id: response.data._id, images: images };
    })
    .catch((err) => {
      console.log(err);
    });
};

export const uploadImagesTownhouse = async (id: string, images: FileWithPath[]) => {
  const formData = new FormData();
  console.log(images);

  images.forEach((image) => {
    formData.append("images", image);
    console.log(formData);
  });

  return api
    .post(`${townhouse}images/${id}`, formData)
    .then((response) => {
      console.log(response);
      showNotification({
        title: "Thành công!",
        message: "Tải ảnh lên thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const uploadImages360Townhouse = async (id: string, images360: FileWithPath[]) => {
  const formData = new FormData();

  images360.forEach((image360) => {
    formData.append("images360", image360);
    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }
  });

  return api
    .post(`${townhouse}images360/${id}`, formData)
    .then((response) => {
      console.log(response);
      showNotification({
        title: "Thành công!",
        message: "Tải ảnh 360 lên thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteImages360Townhouse = async (id: string, images360: string[]) => {
  const imagesForDelete = images360.map((image360) => {
    return image360.replace(imageRoute, "");
  });

  return api
    .post(`${townhouse}images360/delete/${id}`, { name: imagesForDelete })
    .then((response) => {
      console.log(response);
      showNotification({
        title: "Thành công!",
        message: "Xóa ảnh 360 thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteImagesTownhouse = async (id: string, images: string[]) => {
  const imagesForDelete = images.map((image) => {
    return image.replace(imageRoute, "");
  });

  return api
    .post(`${townhouse}images/delete/${id}`, { name: imagesForDelete })
    .then((response) => {
      console.log(response);
      showNotification({
        title: "Thành công!",
        message: "Xóa ảnh thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createNewTownhouse = async (townhouseData: {
  name: string;
  description: string;
  address: string;
  images: string[];
  price: number | undefined;
  numberOfCustomer: number | undefined;
  type: number;
  lat: number;
  lng: number;
  deposit: number;
  needToContact: boolean;
  contactInfor: string;
}) => {
  return api
    .post(townhouse, { ...townhouseData, deposit: toPercentage(townhouseData.deposit), images: [], images360: [], amenities: [] })
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Tạo nhà phố thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
      return { ...response.data, id: response.data._id };
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteTownhouse = async (townhouseId: string) => {
  return api
    .delete(townhouse + townhouseId)
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Xóa nhà phố thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateTownhouse = async (
  townhouseId: string,
  townhouseData: {
    name: string;
    description: string;
    address: string;
    price: number | undefined;
    numberOfCustomer: number | undefined;
    lat: number;
    lng: number;
    amenities: { icon: string; description: string }[];
    images: string[];
    images360: string[];
    deposit: number;
    needToContact: boolean;
    contactInfor: string;
    // images: string[];
    // available: boolean;
  }
) => {
  townhouseData.images = townhouseData.images.map((image) => {
    return image.replace(imageRoute, "");
  });
  townhouseData.images360 = townhouseData.images360.map((image) => {
    return image.replace(imageRoute, "");
  });
  return api
    .put(townhouse + townhouseId, { ...townhouseData, deposit: toPercentage(townhouseData.deposit), type: 2 })
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Cập nhật nhà phố thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};
