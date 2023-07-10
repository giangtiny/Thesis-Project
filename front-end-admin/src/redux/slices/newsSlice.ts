import { NewsProps } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: NewsProps = {
  id: "",
  title: "",
  thumbnail: "",
  time: "",
  tag: "",
  content: [],
};

export const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setAllNews: (state, action) => {
      return { ...state, logged: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => state);
  },
});
