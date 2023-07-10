import { createSlice } from "@reduxjs/toolkit";

interface userProps {
  logged: boolean;
  jwtKey: string;
  info: {
    name: string;
    username: string;
    role: string;
    email: string;
    phoneNumber: string;
    address: string;
    avatar?: string;
  }
}

const initialState: userProps = {
    logged: false,
    jwtKey: '',
    info: {
      name: '',
      username: '',
      role: '',
      email: '',
      phoneNumber: '',
      address: ''
    }
  }

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLogin: (state, action) => {
      return {...state, logged: action.payload};
    },
    setJwtKey: (state, action) => {
      return {...state, jwtKey: action.payload};
    },
    setUser: (state, action) => {
      return {...state, logged: action.payload.logged, jwtKey: action.payload.jwtKey};
    },
    setUserInfo: (state, action) => {
      // console.log('check', action.payload)
      // const info = {...state.info, name: action.payload.user[0].name, username: action.payload.username, role: action.payload.role, email: action.payload.email, phoneNumber: action.payload.user[0].phoneNumber, address: action.payload.user[0].address}
      // return {...state, info: info}
      return {...state}
    }
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => state);
  }
});