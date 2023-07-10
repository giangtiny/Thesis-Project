import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: Array<string> = [];
const imageRoute = 'http://localhost:8080/static/images/';

export const imagesHotelSelectSlice = createSlice({
  name: 'imagesHotelSelect',
  initialState,
  reducers: {
    setImagesHotelSelect: (state, action: PayloadAction<string>) => {
      const image = action.payload.replace(imageRoute, '');
      if (state.includes(image)) {
        state = state.filter((item) => item != image);
        return [...state];
      }
      return [...state, image];
    },
    clearImagesHotelSelect: (state) => {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => state);
  },
});
