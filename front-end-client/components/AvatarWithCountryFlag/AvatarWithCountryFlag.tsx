import { useState } from 'react';
import { Avatar, Badge, Image } from '@mantine/core';
import { useAvatarWithCountryFlagStyle } from './AvatarWithCountryFlag.style';

interface Props {
  size: number;
  image: string;
  countryCode: string;
  style: React.CSSProperties;
}

export function AvatarWithCountryFlag(props: Props) {
  const { size, countryCode, image, style } = props;
  const { classes } = useAvatarWithCountryFlagStyle();

  return (
    <div className={classes.MainAva} style={{ width: size, height: size, ...style }}>
      <Avatar src={image} w={size} h={size} />
      <Image
        className={classes.CountryFlag}
        width={24}
        src={`https://flagsapi.com/${countryCode}/flat/48.png`}
        alt="flag"
        fit="none"
      />
    </div>
  );
}
