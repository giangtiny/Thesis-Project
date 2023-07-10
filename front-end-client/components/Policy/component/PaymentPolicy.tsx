import { Text } from '@mantine/core';

const PaymentPolicy = () => {
  return (
    <>
      <Text size="xl" weight="bold" align="center">
        Chính sách thanh toán
      </Text>
      <Text>
        Khách hàng sử dụng 1 trong 3 hình thức thanh toán dưới đây để thực hiện thanh toán tiền
        phòng trên website trebaybooking.com:
      </Text>
      <ul>
        <li>
          <Text>
            <strong>THẺ TÍN DỤNG (VISA VÀ MASTER CARD)</strong> - Khách hàng lựa chọn hình thức
            thanh toán này tại phần thông tin thanh toán khi đặt đơn đặt phòng trên website
            trebaybooking.com. Khi sử dụng hình thức thanh toán này, Khách hàng sẽ phải trả phí dịch
            vụ cho Ngân hàng/Nhà phát hành thẻ.
          </Text>
        </li>
        <li>
          <Text>
            <strong>TIỀN MẶT</strong> - Khách hàng lựa chọn hình thức thanh toán này tại phần thông
            tin thanh toán khi đặt đơn đặt phòng trên website trebaybooking.com. Khách hàng đến văn
            phòng của <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> để thanh
            toán tiền hoặc nộp tiền trực tiếp vào tài khoản ngân hàng của{' '}
            <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> theo đúng thông tin
            hướng dẫn khi lựa chọn hình thức thanh toán này.
          </Text>
        </li>
        <li>
          <Text>
            <strong>DỊCH VỤ TRUNG GIAN THANH TOÁN</strong> - Khách hàng lựa chọn hình thức thanh
            toán này tại phần thông tin thanh toán khi đặt đơn đặt phòng trên website
            trebaybooking.com. Sau khi lựa chọn hình thức thanh toán này, Khách hàng sẽ thực hiện
            trực tiếp các bước thanh toán trên website của Cổng thanh toán .
          </Text>
        </li>
      </ul>
    </>
  );
};

export default PaymentPolicy;
