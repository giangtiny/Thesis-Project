import React from 'react';
import { ASSET_TEXT } from '@/constants/asset';
import { HotelProps, VillaProps } from '@/utils/types';

export const useNormalizeFormData = ({
  type,
  initialValues,
}: {
  type: string;
  initialValues?: Object;
}) => {
  switch (type) {
    case ASSET_TEXT.HOTEL:
      return initialValues ? initialValues : ({} as HotelProps);
    case ASSET_TEXT.VILLA:
    case ASSET_TEXT.TOWN_HOUSE:
      return initialValues ? initialValues : ({} as VillaProps);
    default:
      return {} as VillaProps;
  }
};
