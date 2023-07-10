import { Text, Group } from '@mantine/core';

const RefundAndReturnPolicy = () => {
  return (
    <>
      <Text size="xl" weight="bold" align="center" style={{ marginBottom: '1rem' }}>
        Chính sách đổi trả và hoàn tiền
      </Text>
      <Text size="sm" weight="bold" align="center" underline={true}>
        QUY ĐỊNH VỀ NHẬN VÀ TRẢ PHÒNG
      </Text>
      <ul>
        <li>
          <Text>Thời gian nhận phòng: từ 14:00 (2 PM) trở đi của ngày nhận phòng.</Text>
        </li>
        <li>
          <Text>Thời gian trả phòng: trễ nhất vào 12:00 (12 PM) của ngày trả phòng.</Text>
        </li>
        <li>
          <Text>Phương thức nhận phòng: SELF-CHECK-IN (Tự nhận phòng).</Text>
        </li>
        <li>
          <Text>
            Hướng dẫn nhận phòng: Trong vòng 01 ngày trước ngày nhận phòng thực tế, nhân viên của
            Cozrum sẽ liên hệ đến Khách hàng để xác nhận thời gian nhận phòng dự kiến và gửi Hướng
            dẫn nhận phòng (dưới dạng đường link) qua địa chỉ mail hoặc zalo cho Khách hàng.
          </Text>
        </li>
      </ul>
      <Text size="sm" weight="bold" align="center" underline={true}>
        QUY TRÌNH HỦY, ĐỔI TRẢ, THAY ĐỔI THỜI GIAN NHẬN/TRẢ PHÒNG
      </Text>
      <ul>
        <li>
          <Text weight="600">Chính sách hủy phòng:</Text>
          <Text>
            Khách hàng được miễn phí hủy đặt phòng 01 ngày trước ngày nhận phòng thực tế. Trường hợp
            khách hàng không đến nhận phòng, phí phạt sẽ là tiền phòng đêm đầu tiên. Khách hủy đặt
            phòng phù hợp với chính sách, phí phòng đã thanh toán sẽ được hoàn trả trong vòng 02 –
            05 ngày làm việc.
          </Text>
        </li>
        <li>
          <Text weight="600">Chính sách đổi trả phòng:</Text>
          <Text>
            Trường hợp phòng đã đặt gặp sự cố không thể phục vụ, khách hàng sẽ được miễn phí nâng
            hạng phòng hoặc linh hoạt chuyển đổi chi nhánh. Trường hợp khách không chấp thuận giải
            pháp được đề xuất, phí phòng đã thanh toán trước sẽ được hoàn trả trong vòng 02 – 05
            ngày làm việc.
          </Text>
        </li>
        <li>
          <Text weight="600">Chính sách thay đổi thời gian nhận/trả phòng:</Text>
          <Text>
            Khách hàng sẽ được miễn phí thay đổi ngày nhận/trả phòng trong trường hợp thông báo với
            nhân viên 01 ngày trước ngày nhận/trả phòng thực tế.
          </Text>
          <Text>
            Trường hợp khách thông báo trễ hơn thời gian quy định, nhân viên sẽ dựa theo tình trạng
            phòng thực tế để đáp ứng nhu cầu của khách hàng và phí thay đổi sẽ được tính theo tỷ lệ
            phần trăm dựa trên giá phòng.
          </Text>
        </li>
      </ul>
    </>
  );
};

export default RefundAndReturnPolicy;
