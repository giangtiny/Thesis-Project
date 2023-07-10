import { showNotification } from "@mantine/notifications";
import { api } from "../axios";
import { IconCheck } from "@tabler/icons";
import { styles } from "@/utils/toasts";

const comment = "comment";

export const getCommentAPI = async (id: string) => {
  // if (type === "town-house") type = "townhouse";
  return api
    .get(`${comment}/all/detail?id=${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
export interface CommentAddDto {
  id: string;
  type: string;
  date: string;
  content: string;
  ownerID: string;
  parentId: string;
  level: number;
}
export const addCommentAPI = async (dataAdd: CommentAddDto) => {
  let { id, type, date, content, ownerID, parentId, level } = dataAdd;
  if (ownerID == "000000000000000000000000") ownerID = "";
  if (type === "town-house") type = "townhouse";
  return api
    .post(`${comment}?accommodationType=${type}`, {
      accommodationID: id,
      date: date,
      content: content,
      userID: ownerID || "649720464f9af8b793609a5a",
      phoneNumber: "",
      parentID: parentId,
      starRating: 4,
      level: level,
    })
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Thêm bình luận thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
export interface CommentUpdateDto {
  accommodationID: string;
  id: string;
  type: string;
  date: string;
  content: string;
  ownerID: string;
  parentId: string;
  level: number;
  userName: string;
  userAvatar: string;
  phoneNumber: string;
}
export const updateCommentAPI = async (dataUpdate: CommentUpdateDto) => {
  let { id, type, date, content, ownerID, parentId, level, accommodationID, userName, userAvatar, phoneNumber } = dataUpdate;
  if (ownerID == "000000000000000000000000") ownerID = "";
  if (type === "town-house") type = "townhouse";
  return api
    .put(`${comment}?id=${id}`, {
      accommodationID: accommodationID,
      date: date,
      content: content,
      userID: ownerID || "649720464f9af8b793609a5a",
      parentID: parentId,
      starRating: 4,
      level: level,
      userName: userName,
      userAvatar: userAvatar,
      phoneNumber: phoneNumber || "",
    })
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Chỉnh sửa bình luận thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteCommentAPI = async (id: string, level: number) => {
  return api
    .delete(`${comment}?id=${id}&level=${level}`)
    .then((response) => {
      showNotification({
        title: "Thành công!",
        message: "Xóa bình luận thành công",
        icon: <IconCheck />,
        styles: (theme) => styles("green", theme),
      });
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};
