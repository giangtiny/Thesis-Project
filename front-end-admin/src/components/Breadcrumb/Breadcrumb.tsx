import { TextInput, TextInputProps, ActionIcon, useMantineTheme, Breadcrumbs, Anchor } from '@mantine/core';

export function Breadcrumb(props: TextInputProps) {
  const items = [
    { title: 'Trang chủ', href: '/' },
    { title: 'Khách sạn', href: '/hotel' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Breadcrumbs>{items}</Breadcrumbs>
  );
}
