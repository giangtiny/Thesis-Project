import { api } from '../axios';

const loginPath = 'user/login';

export const login = async (account: {username: string, password: string}) => {
  return await api
  .post(loginPath, account)
  .then((response) =>{
    return {data: response.data, statusText: response.statusText};
  })
  .catch((error) => {
    console.log(error);
  });
};
