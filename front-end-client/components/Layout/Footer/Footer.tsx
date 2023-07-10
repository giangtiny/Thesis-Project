import React, { ReactNode } from 'react';
import { Text, Container, Group, ActionIcon } from '@mantine/core';
import { useFooterStyles } from './Footer.style';
import { IconFacebook, IconYoutube, IconInstagram, LogoWhite } from '@/icons/index';
import { COPY_RIGHT_TEXT, FOLLOW_US_TEXT } from '@/constants/static-data';
import Link from 'next/link';

interface FooterLinksProps {
  data: {
    title: string;
    links: { label: ReactNode; link: string; disabled: boolean }[];
  }[];
}

export function Footer({ data }: FooterLinksProps) {
  const { classes } = useFooterStyles();
  const icons = [
    <IconFacebook size={25} stroke={1.5} key={1} />,
    <IconYoutube size={25} stroke={1.5} key={2} />,
    <IconInstagram size={25} stroke={1.5} key={3} />
  ];

  const renderLinks = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Link href={link.link} key={index}>
        <Text<'a'>
          className={`${classes.link} ${link.disabled && classes.linkDisabled}`}
          component="a"
          href={link.link}>
          {link.label}
        </Text>
      </Link>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  const renderFooterText = (text: string) => {
    return <Text className={classes.footerText}>{text}</Text>;
  };

  const renderFooterIcon = (icon: ReactNode, index: number) => {
    return (
      <ActionIcon size="lg" variant="subtle" key={index}>
        {icon}
      </ActionIcon>
    );
  };

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner} size="xl">
        <LogoWhite className={classes.logo} />
        <div className={classes.groups}>{renderLinks}</div>
      </Container>
      <Container className={classes.afterFooter} size="xl">
        {renderFooterText(COPY_RIGHT_TEXT)}
        <Group spacing={10} className={classes.social} position="right" noWrap>
          {renderFooterText(FOLLOW_US_TEXT)}
          {icons.map((icon, index) => renderFooterIcon(icon, index))}
        </Group>
      </Container>
    </footer>
  );
}
