import { FileWithPath } from "@mantine/dropzone";
import { MantineTheme } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { api } from "../axios";
import { IconCheck, IconX } from "@tabler/icons";
import { styles } from "@/utils/toasts";
import { UseFormReturnType } from "@mantine/form";
import { HotelProps } from "@/utils/types";
import { toPercentage } from "@/utils/formats";

const hotel = "hotel/";

const imageRoute = "http://trebaybooking.com/static/images/";

export const getAllHotel = async () => {
  return api
    .get(hotel + "all")
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getCurrentHotel = async (id: string) => {
  return api
    .get(hotel + id)
    .then((response) => {
      const { images, images360 } = response.data;
      images.forEach((image: string, index: number, images: string[]) => {
        images[index] = imageRoute + image;
      });
      images360?.forEach((image: string, index: number, images: string[]) => {
        images[index] = imageRoute + image;
      });
      return { ...response.data, images, images360 };
    })
    .catch((err) => {
      console.log(err);
    });
};

export const uploadImages = async (id: string, images: FileWithPath[]) => {
  const formData = new FormData();
  console.log(images);

  images.forEach((image) => {
    console.log("check", image);
    formData.append("images", image);
    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }
  });

  console.log("data image", formData);
  for (var key of formData.entries()) {
    console.log(key[0] + ", " + key[1]);
  }

  return api
    .post(`${hotel}images/${id}`, formData)
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

export const uploadImages360 = async (id: string, images360: FileWithPath[]) => {
  const formData = new FormData();

  images360.forEach((image360) => {
    formData.append("images360", image360);
    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }
  });

  console.log("data image", formData);
  for (var key of formData.entries()) {
    console.log(key[0] + ", " + key[1]);
  }

  return api
    .post(`${hotel}images360/${id}`, formData)
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

export const deleteImages = async (id: string, images: string[]) => {
  const imagesforDelete = images.map((image) => {
    return image.replace(imageRoute, "");
  });

  return api
    .post(`${hotel}images/delete/${id}`, { name: imagesforDelete })
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

export const deleteImages360 = async (id: string, images360: string[]) => {
  const imagesforDelete = images360.map((image360) => {
    return image360.replace(imageRoute, "");
  });

  return api
    .post(`${hotel}images360/delete/${id}`, { name: imagesforDelete })
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

export const createNewHotel = async (hotelData: {
  name: string;
  description: string;
  address: string;
  dayOrderMaxRoom: number;
  deposit: number;
  lat: number;
  lng: number;
  promotionDescription: string;
  needToContact: boolean;
  contactInfor: string;
}) => {
  return api
    .post(hotel, { ...hotelData, deposit: toPercentage(hotelData.deposit), images: [], images360: [], amenities: [] })
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Tạo khách sạn thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteHotel = async (hotelId: string) => {
  return api
    .delete(hotel + hotelId)
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Xóa khách sạn thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateHotel = async (
  hotelId: string,
  hotelData: {
    name: string;
    description: string;
    address: string;
    dayOrderMaxRoom: number;
    deposit: number;
    lat: number;
    lng: number;
    amenities: { icon: string; description: string }[];
    images: string[];
    images360: string[];
    promotionDescription: string;
    needToContact: boolean;
    contactInfor: string;
  }
) => {
  hotelData.images = hotelData.images.map((image) => {
    return image.replace(imageRoute, "");
  });
  hotelData.images360 = hotelData.images360.map((image) => {
    return image.replace(imageRoute, "");
  });

  return api
    .put(hotel + hotelId, { ...hotelData, deposit: toPercentage(hotelData.deposit) })
    .then((response) => {
      console.log(response);
      showNotification({
        title: "Thành công!",
        message: "Cập nhật khách sạn thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
