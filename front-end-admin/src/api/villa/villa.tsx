import { FileWithPath } from "@mantine/dropzone";
import { MantineTheme } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { api } from "../axios";
import { IconCheck, IconX } from "@tabler/icons";
import { styles } from "@/utils/toasts";
import { UseFormReturnType } from "@mantine/form";
import { VillaProps } from "@/utils/types";
import { toPercentage } from "@/utils/formats";

const villa = "villa/";

const imageRoute = "http://trebaybooking.com/static/images/";

export const getAllVilla = async () => {
  return api
    .get(villa + "all")
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

export const getCurrentVilla = async (id: string) => {
  return api
    .get(villa + id)
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

export const uploadImagesVilla = async (id: string, images: FileWithPath[]) => {
  const formData = new FormData();
  console.log(images);

  images.forEach((image) => {
    formData.append("images", image);
    console.log(formData);
  });

  return api
    .post(`${villa}images/${id}`, formData)
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

export const uploadImages360Villa = async (id: string, images360: FileWithPath[]) => {
  const formData = new FormData();
  console.log(images360);

  images360.forEach((image360) => {
    formData.append("images360", image360);
    console.log(formData);
  });

  return api
    .post(`${villa}images360/${id}`, formData)
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

export const deleteImagesVilla = async (id: string, images: string[]) => {
  const imagesForDelete = images.map((image) => {
    return image.replace(imageRoute, "");
  });

  return api
    .post(`${villa}images/delete/${id}`, { name: imagesForDelete })
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

export const deleteImages360Villa = async (id: string, images360: string[]) => {
  const imagesForDelete = images360.map((image360) => {
    return image360.replace(imageRoute, "");
  });

  return api
    .post(`${villa}images360/delete/${id}`, { name: imagesForDelete })
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

export const createNewVilla = async (villaData: {
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
  console.log("object villa data", villaData);
  return api
    .post(villa, { ...villaData, numberOfCustomer: Number(villaData.numberOfCustomer), deposit: toPercentage(villaData.deposit), images: [], images360: [], amenities: [] })
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Tạo Villa thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
      return { ...response.data, id: response.data._id };
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteVilla = async (villaId: string) => {
  return api
    .delete(villa + villaId)
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Xóa Villa thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateVilla = async (
  villaId: string,
  villaData: {
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
  console.log("check", { ...villaData });
  return api
    .put(villa + villaId, { ...villaData, type: 1, deposit: toPercentage(villaData.deposit) })
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Cập nhật Villa thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};
