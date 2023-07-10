import { styles } from '@/utils/toasts';
import { UserProps } from '@/utils/types';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from "@tabler/icons";
import { api } from '../axios';

const userPath = 'user/info';
const admin = 'admin/';
const user = 'user/'

export const getUserInfo = async () => {
  return await api
  .get(userPath)
  .then((response) =>{
    // console.log('response', response)
    return {data: response.data, statusText: response.statusText};
  })
  .catch((error) => {
    console.log(error);
  });
};

export const addUserInfo = async (userData: UserProps) => {
  return await api
  .post(admin + user, {
    ...userData
  })
  .then((response) => {
    showNotification({
      title: 'Thành công!',
      message: 'Tạo tài khoản thành công',
      styles: (theme) => styles('green', theme),
    });
    return response;
  })
  .catch((error) => {
    console.log(error);
  });
};

export const updateUserInfo = async (userData: UserProps) => {
  return await api
  .put(admin + userPath, {
    ...userData
  })
  .then((response) => {
    showNotification({
      title: 'Thành công!',
      message: 'Cập nhật tài khoản thành công',
      styles: (theme) => styles('green', theme),
    });
    return response;
  })
  .catch((error) => {
    console.log(error);
  });
};

export const deleteUser = async (userId: string) => {
  return await api
  .delete(user + userId)
  .then((response) => {
    showNotification({
      title: 'Thành công!',
      message: 'Xóa tài khoản thành công',
      styles: (theme) => styles('green', theme),
    });
    return response;
  })
  .catch((error) => {
    console.log(error);
  });
};

