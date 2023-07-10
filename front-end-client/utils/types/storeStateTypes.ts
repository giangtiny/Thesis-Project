import { rootReducer } from '@redux/reducers';

export type RootState = ReturnType<typeof rootReducer>;

export type DateSelectedStateProps = [Date | null, Date | null];

export type HotelBookingTime = {
  checkinTime: Date | null;
  checkoutTime: Date | null;
};

export interface CarouselProps {
  images: string[];
  link?: string;
  type: string;
}

export interface VillaCardProps {
  id: string;
  images: string[];
  name: string;
  address: string;
  star: number;
  price?: number;
  size?: 'sm' | 'md';
  isForContact: boolean;
  phone: string;
  images360: string[];
  lat: number;
  lng: number;
  boxWidth?: string;
  ownerID?: string;
  totalRoom?: number;
  dayOrderMaxRoom?: number;
  promotionDescription?: string;
  needToContact?: boolean;
  deposit?: number;
  minRoomPrice?: number;
  amenities: {
    icon: string;
    _id: string;
    description: string;
  }[];
}

export interface HotelProps extends VillaCardProps {
  description: string;
}

export interface CommentDto {
  _id: string;
  hotelID?: string;
  date: string;
  content: string;
  userID: string;
  userName: string;
  userAvatar: string;
  phoneNumber: string;
  parentID?: string;
  starRating: number;
  level: number;
  replyComment: CommentDto[];
}

export type Hotels = HotelProps[];

export interface RoomProps {
  id: string;
  number: number;
  beds: number;
  available: boolean;
}

export type HotelsLevel = RoomProps[];

export type HotelsRooms = HotelsLevel[];

export interface GuestSelectProps {
  elder: number;
  children: number;
}

export interface IPaymentInformation {
  paymentType: 'palpay' | 'vnpay';
  guestCount: GuestSelectProps;
  date: HotelBookingTime;
  bookerInfo: {
    name: string;
    phoneNum: string;
    email: string;
  };
}
