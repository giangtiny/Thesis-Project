import { Text, Card, Group, Stack, Radio } from '@mantine/core';
import { usePaymentOptionButtonStyle } from './PaymentOptionButton.style';
import { useSelector } from 'react-redux';
import { selectPaymentType } from '@redux/selectors';
import { useAppDispatch } from '@redux/store';
import { paymentActions } from '@redux/slices';

interface IPaymentOptionButton {
  value: 'momo' | 'bank' | 'vnpay';
  icon: any;
  label: string;
}

const PaymentOptionButton = (props: IPaymentOptionButton) => {
  const { classes, cx } = usePaymentOptionButtonStyle();
  const { value, icon: Icon, label } = props;
  const paymentType = useSelector(selectPaymentType);
  const dispatch = useAppDispatch();
  const { setPaymentType } = paymentActions;

  return (
    <Card
      radius="sm"
      className={cx(classes.container, { [classes.containerActive]: paymentType === value })}
      onClick={() => dispatch(setPaymentType(value))}
      p="xs">
      <Group position="apart" pl={8} pr={8}>
        <Group display={'flex'}>
          <Icon height={40} width={40} />
          <Text align="center">{label}</Text>
        </Group>
        <Radio value={value} checked={paymentType === value} color="green" />
      </Group>
    </Card>
  );
};

export default PaymentOptionButton;
