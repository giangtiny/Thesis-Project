import { dateSlice } from './dateSlice';
import { hotelSlice } from './hotelSlice';
import { roomSlice } from './roomSlice';
import { guestSlice } from './guestSlice';
import { paymentSlice } from './paymentSlice';

const dateActions = dateSlice.actions;

const roomActions = roomSlice.actions;

const guestActions = guestSlice.actions;

const paymentActions = paymentSlice.actions;

const hotelActions = hotelSlice.actions;

export {
  dateSlice,
  dateActions,
  hotelSlice,
  hotelActions,
  roomActions,
  roomSlice,
  guestSlice,
  guestActions,
  paymentSlice,
  paymentActions
};
