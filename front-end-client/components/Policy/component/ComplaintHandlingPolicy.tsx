import { Text } from '@mantine/core';

const ComplaintHandlingPolicy = () => {
  return (
    <>
      <Text size="xl" weight="bold" align="center">
        Chính sách xử lý khiếu nại
      </Text>
      <ul>
        <li>
          <Text>
            Tiếp nhận mọi khiếu nại của khách hàng liên quan đến việc sử dụng dịch vụ của công ty.
          </Text>
        </li>
        <li>
          <Text>
            Tất cả mọi trường hơp bảo hành, quý khách có thể liên hệ với chúng tôi để làm thủ tục
            bảo hành.
          </Text>
        </li>
        <li>
          <Text>
            Thời gian giải quyết khiếu nại trong thời hạn tối đa là 03 (ba) ngày làm việc kể từ khi
            nhận được khiếu nại của của khách hàng. Trong trường hợp bất khả kháng 2 bên sẽ tự
            thương lượng.
          </Text>
        </li>
      </ul>
    </>
  );
};

export default ComplaintHandlingPolicy;
