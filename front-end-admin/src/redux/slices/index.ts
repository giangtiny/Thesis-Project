import { navbarSlice } from './navbarSlice';
import { imagesHotelSelectSlice } from './imagesHotelSlice';
import { userSlice } from './user';
import { roomSelectSlice } from './roomSelectSlice';

const navbarActions = navbarSlice.actions;
const imagesHotelActions = imagesHotelSelectSlice.actions;
const userActions = userSlice.actions;
const roomSelectActions = roomSelectSlice.actions;

export {
  navbarSlice,
  navbarActions,
  imagesHotelSelectSlice,
  imagesHotelActions,
  userSlice,
  userActions,
  roomSelectSlice,
  roomSelectActions,
};
