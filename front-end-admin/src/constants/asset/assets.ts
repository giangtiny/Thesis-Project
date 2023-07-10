export const ASSET_TEXT = {
  HOTEL: 'hotel',
  VILLA: 'villa',
  TOWN_HOUSE: 'town-house',
};

export const ASSET_NAME = {
  [ASSET_TEXT.HOTEL]: 'Khách sạn',
  [ASSET_TEXT.VILLA]: 'Villa',
  [ASSET_TEXT.TOWN_HOUSE]: 'Nhà phố',
};

export const ASSET_NUMBER = {
  [ASSET_TEXT.HOTEL]: 0,
  [ASSET_TEXT.VILLA]: 1,
  [ASSET_TEXT.TOWN_HOUSE]: 2,
};

export const ASSET_ROLE = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_STAFF_COLLABORATOR', 'ROLE_STAFF', 'ROLE_COLLABORATOR'];

export const ORDER_TYPE_TEXT = {
  0: 'Theo giờ',
  1: 'Theo ngày',
};

export const ORDER_TYPE = {
  HOUR: 0,
  DAY: 1,
};

export const DISCOUNT_TYPE = {
  0: 'percentage',
  1: 'cash',
};

export const FEE = {
  saturday: 'saturdayFee',
  sunday: 'sundayFee',
  normal: 'normalDayFee',
}

export const DISCOUNT_TYPE_VALUE = {
  percentage: 0,
  cash: 1,
};

export const TIME_TEXT = {
  date: 'date',
  month: 'month',
  year: 'year',
}