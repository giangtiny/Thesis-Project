import { Container, Title, createStyles, Select } from '@mantine/core';
import { IconHash } from '@tabler/icons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ComplaintHandlingPolicy from './component/ComplaintHandlingPolicy';
import InformationPrivacyPolicy from './component/InformationPrivacyPolicy';
import PaymentPolicy from './component/PaymentPolicy';
import RefundAndReturnPolicy from './component/RefundAndReturnPolicy';

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    minHeight: 650
  },

  title: {
    marginBottom: `calc(${theme.spacing.xl} * 2.5)`
  },
  select: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl
  }
}));
const PoliciesComponent = [
  <PaymentPolicy key={'Chính sách thanh toán'} />,
  <ComplaintHandlingPolicy key={'Chính sách xử lý khiếu nại'} />,
  <RefundAndReturnPolicy key={'Chính Sách Bảo Mật Thông Tin'} />,
  <InformationPrivacyPolicy key={'Chính Sách Bảo Mật Thông Tin'} />
];

export function Policy() {
  const { classes } = useStyles();
  const router = useRouter();
  const { id } = router.query;

  const onChangeSelect = (e: any) => {
    router.push('/policies/' + e);
  };

  return (
    <Container size="sm" className={classes.wrapper}>
      <Title align="center" className={classes.title}>
        CHÍNH SÁCH VÀ QUY ĐỊNH
      </Title>
      <Select
        className={classes.select}
        onChange={(e) => onChangeSelect(e)}
        icon={<IconHash size={14} />}
        placeholder="Chính sách và quy định"
        data={[
          { value: '0', label: 'Chính sách thanh toán' },
          { value: '1', label: 'Chính sách xử lý khiếu nại' },
          { value: '2', label: 'Chính đổi trả và hoàn tiền' },
          { value: '3', label: 'Chính Sách Bảo Mật Thông Tin' }
        ]}
      />
      {PoliciesComponent[Number(id)]}
    </Container>
  );
}
