import { styles } from "@/utils/toasts";

import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import { api } from "../axios";
import { NewsProps } from "@/utils/types";

const newsPath = "news";
const allNews = "news/all";

const newsContentPath = "newsContent";
const imageRoute = "http://trebaybooking.com/static/images/";

export const getAllNews = async () => {
  return await api
    .get(allNews)
    .then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        response.data[i].thumbnail = imageRoute + response.data[i].thumbnail;
      }

      return { data: response.data, statusText: response.statusText };
    })
    .catch((error) => {
      console.log(error);
    });
};
export const getNewsById = async (id: string) => {
  return await api
    .get(`${newsPath}/${id}`)
    .then((response) => {
      for (let i = 0; i < response.data.content.length; i++) {
        response.data.content[i].image = imageRoute + response.data.content[i].image;
      }
      return { data: response.data, statusText: response.statusText };
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteNewsApi = async (newsId: string) => {
  return await api
    .delete(`${newsPath}/${newsId}`)
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Xóa tin tức thành công",
        styles: (theme) => styles("green", theme),
      });
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createNews = async (data: any) => {
  let formData = new FormData();
  const newData = {
    title: data.title,
    tag: data.tag,
    time: data.time,
  };
  formData.append("news", JSON.stringify(newData));
  formData.append("thumbnail", data.thumbnail);

  return await api({
    method: "post",
    url: newsPath,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Tạo tin tức thành công",
        styles: (theme) => styles("green", theme),
      });
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateNewsApi = async (data: any) => {
  let formData = new FormData();
  if (data.thumbnail instanceof File) {
    const newData = {
      title: data.title,
      tag: data.tag,
      time: data.time,
    };
    formData.append("news", JSON.stringify(newData));
    formData.append("thumbnail", data.thumbnail);
  } else {
    const newData = {
      title: data.title,
      tag: data.tag,
      time: data.time,
      thumbnail: data.thumbnail.replace(imageRoute, ""),
    };
    formData.append("news", JSON.stringify(newData));
  }
  return await api({
    method: "put",
    url: `${newsPath}/${data.id}`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Cập nhật tin tức thành công",
        styles: (theme) => styles("green", theme),
      });
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
};

//News - contents

export const createNewsContent = async (data: any) => {
  let formData = new FormData();
  const newData = {
    header: data.header,
    highLight: data.highLight,
    text: data.text,
  };
  formData.append("newsContent", JSON.stringify(newData));
  formData.append("image", data.image);

  return await api({
    method: "post",
    url: `${newsContentPath}/${data.newsId}`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Tạo đoạn tin tức thành công",
        styles: (theme) => styles("green", theme),
      });
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateNewsContentApi = async (data: any) => {
  let formData = new FormData();
  if (data.image instanceof File) {
    const newsContentData = {
      newsId: data.newsId,
      header: data.header,
      text: data.text,
      highLight: data.highLight,
    };
    formData.append("newsContent", JSON.stringify(newsContentData));
    formData.append("image", data.image);
  } else {
    const newsContentData = {
      newsId: data.newsId,
      header: data.header,
      text: data.text,
      highLight: data.highLight,
      image: data.image?.replace(imageRoute, ""),
    };
    formData.append("newsContent", JSON.stringify(newsContentData));
  }
  return await api({
    method: "put",
    url: `${newsContentPath}/${data.id}`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteNewsContentApi = async (newsContentId: string) => {
  return await api
    .delete(`${newsContentPath}/${newsContentId}`)
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Xóa đoạn tin tức thành công",
        styles: (theme) => styles("green", theme),
      });
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
};
