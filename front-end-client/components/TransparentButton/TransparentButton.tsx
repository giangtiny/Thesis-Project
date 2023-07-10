import { Button, Text } from '@mantine/core';
import Link from 'next/link';
import { useTransparentButtonStyle } from './TransparentButton.style';
import React, { ReactNode } from 'react';

interface Props {
  isLink: boolean;
  link?: string;
  label: string;
  children: ReactNode;
}

export default function TransparentButton(props: Props) {
  const { classes } = useTransparentButtonStyle();

  return (
    <div className={classes.mainButton}>
      {props.isLink ? (
        <Link href={props.link || ''} key={props.label}>
          <Text>{props.children}</Text>
        </Link>
      ) : (
        props.children
      )}
    </div>
  );
}
