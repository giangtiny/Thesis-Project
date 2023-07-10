import { IOrderHourPolicy } from "./orderType";

export interface AssetProps {
  ownerID: string;
  id: string;
  name: string;
  address: string;
  images: string[];
  images360: string[];
  amenities: {
    icon: string;
    description: string;
  }[];
  description: string;
  lat: number;
  lng: number;
  needToContact: boolean;
  contactInfor: string;
}

export interface HotelProps extends AssetProps {
  totalRoom: number | undefined;
  rooms?: string[];
  price?: never;
  surchargeFee?: never;
  promotion?: never;
  cancelFee?: never;
  promotionDescription: string;
  depositPrice?: never;
  numberOfCustomer?: never;
  available?: never;
  dayOrderMaxRoom: number;
  deposit: number;
  type?: never;
}

export interface VillaProps extends AssetProps {
  totalRoom?: never;
  rooms?: never;
  price: number | undefined;
  numberOfCustomer: number | undefined;
  available: boolean;
  deposit?: never;
  dayOrderMaxRoom?: never;
  promotionDescription?: never;
  type: number;
}

export interface TownhouseProps extends AssetProps {
  totalRoom?: never;
  rooms?: never;
  price: number | undefined;
  numberOfCustomer: number | undefined;
  available: boolean;
  deposit?: never;
  dayOrderMaxRoom?: never;
  promotionDescription?: never;
  type: number;
}

export interface RecordRoom {
  id?: string;
  roomNo: string | undefined;
  numberOfBed: string;
  dayPrice: string;
  blocked: boolean;
  hotelID: string;
  hourFeePolicies: IOrderHourPolicy[];
  status?: boolean;
}

export enum AssetType {
  Hotel = "hotel",
  Villa = "villa",
  TownHouse = "town-house",
}

export interface AccountProps {
  ID: string;
  Username: string;
  Password: string;
  Email: string;
  Role: String;
  UserId: string;
}

export interface UserProps {
  ID?: string;
  name?: string;
  phoneNumber?: string;
  username: string;
  password: string;
  email: string;
  address?: string;
  role: string;
}

export interface EventProps {
  name: string;
  quantity: number;
}

export interface HolidayProps {
  id?: string;
  hotelID?: string;
  villaID?: string;
  townHouseID?: string;
  name: string;
  date: Date;
  fee: number;
  promotion: number;
}

export interface WeekendProps {
  hotelID: string;
  month: string;
  sundayFee: number;
  saturdayFee: number;
}

export interface MonthlyProps {
  ID?: string;
  hotelID: string;
  villaID: string;
  townHouseID: string;
  month: string;
  normalDayFee: number;
  sundayFee: number;
  saturdayFee: number;
}

export interface MonthlyProps {
  ID?: string;
  hotelID: string;
  month: string;
  normalDayFee: number;
  sundayFee: number;
  saturdayFee: number;
}

export interface PriceMonthlyProps {
  hotelID: string;
  month: string;
  price: number;
}

export interface NewsProps {
  id: string;
  title: string;
  thumbnail: string;
  time: string;
  tag: string;
  content: NewContent[];
}

export interface NewContent {
  id: string;
  header: string;
  image: string;
  highLight?: string;
  text: string;
}
