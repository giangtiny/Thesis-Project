import { AssetType } from '@/utils/types';

export const HOTEL = '/hotel';
export const VILLA = '/villa';
export const TOWNHOUSE = '/townhouse';
export const ACCOUNTS = '/accounts';
export const ORDERS = '/orders';
export const SETTING = '/setting';
export const DETAIL = '/detail';
export const LOGIN = '/login';
export const NEWS = "/news";
export const DETAIL_ROUTES = {
  [AssetType.Hotel]: HOTEL,
  [AssetType.Villa]: VILLA,
  [AssetType.TownHouse]: TOWNHOUSE,
};
