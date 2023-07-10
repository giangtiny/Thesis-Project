import { Card, Text, Group } from '@mantine/core';

import {
  IconMail,
  IconMapPins,
  IconPhoneCall,
  IconFileCertificate,
  IconBuildingSkyscraper
} from '@tabler/icons';

const InformationPrivacyPolicy = () => {
  return (
    <Card shadow="sm" radius="sm">
      <Text size="xl" weight="bold" align="center">
        Chính sách bảo mật thông tin
      </Text>
      <Text weight={700} size="lg">
        1. Mục đích và phạm vi thu thập thông tin
      </Text>
      <Text>
        <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> không bán, chia sẻ hay
        trao đổi thông tin cá nhân của khách hàng thu thập trên trang web cho một bên thứ ba nào
        khác. Thông tin cá nhân thu thập được sẽ chỉ được sử dụng trong nội bộ công ty. Khi bạn liên
        hệ đăng ký dịch vụ, thông tin cá nhân mà
        <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> thu thập bao gồm:
      </Text>
      <ul>
        <li>Họ và tên</li>
        <li>Địa chỉ</li>
        <li>Điện thoại</li>
        <li>Email</li>
      </ul>
      <Text>Ngoài thông tin cá nhân là các thông tin về dịch vụ:</Text>
      <ul>
        <li>Tên sản phẩm</li>
        <li>Số lượng</li>
        <li>Thời gian giao nhận sản phẩm</li>
      </ul>
      <Text weight={700} size="lg">
        2. Phạm vi sử dụng thông tin
      </Text>
      <Text>
        Thông tin cá nhân thu thập được sẽ chỉ được{' '}
        <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> sử dụng trong nội bộ công
        ty và cho một hoặc tất cả các mục đích sau đây:
      </Text>
      <ul>
        <li>Hỗ trợ khách hàng</li>
        <li>Cung cấp thông tin liên quan đến dịch vụ</li>
        <li>
          Xử lý đơn đặt hàng và cung cấp dịch vụ và thông tin qua trang web của chúng tôi theo yêu
          cầu của bạn
        </li>
        <li>
          Chúng tôi có thể sẽ gửi thông tin sản phẩm, dịch vụ mới, thông tin về các sự kiện sắp tới
          hoặc thông tin tuyển dụng nếu quý khách đăng kí nhận email thông báo.
        </li>
        <li>
          Ngoài ra, chúng tôi sẽ sử dụng thông tin bạn cung cấp để hỗ trợ quản lý tài khoản khách
          hàng; xác nhận và thực hiện các giao dịch tài chính liên quan đến các khoản thanh toán
          trực tuyến của bạn;
        </li>
      </ul>
      <Text weight={700} size="lg">
        3. Thời gian lưu trữ thông tin
      </Text>
      <Text style={{ margin: '1rem 0 1rem 0' }}>
        Đối với thông tin cá nhân, <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong>{' '}
        chỉ xóa đi dữ liệu này nếu khách hàng có yêu cầu, khách hàng yêu cầu gửi mail về
        <strong> booking@gmail.com </strong>
      </Text>
      <Text weight={700} size="lg">
        4. Những người hoặc tổ chức có thể được tiếp cận với thông tin cá nhân
      </Text>
      <Text>
        Đối tượng được tiếp cận với thông tin cá nhân của khách hàng thuộc một trong những trường
        hợp sau:
      </Text>
      <ul>
        <li>CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ DU LỊCH TRE BAY</li>
        <li>
          Các đối tác có ký hợp động thực hiện 1 phần dịch vụ do CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ DU
          LỊCH TRE BAY. Các đối tác này sẽ nhận được những thông tin theo thỏa thuận hợp đồng (có
          thể 1phần hoặc toàn bộ thông tin tuy theo điều khoản hợp đồng) để tiến hành hỗ trợ người
          dùng sử dụng dịch vụ do Công ty cung cấp.
        </li>
      </ul>
      <Text weight={700} size="lg" style={{ margin: '1rem 0 1rem 0' }}>
        5. Địa chỉ của đơn vị thu thập và quản lý thông tin cá nhân
      </Text>
      <Group>
        <IconBuildingSkyscraper />
        <Text>Công ty TNHH Thương mại Dịch vụ Du lịch Tre Bay</Text>
      </Group>
      <Group>
        <IconMapPins />
        <Text>Số 25/1, Thùy Vân, Phường 2 , TP. Vũng Tàu</Text>
      </Group>
      <Group>
        <IconMail />
        <Text>booking@gmail.com</Text>
      </Group>
      <Group>
        <IconPhoneCall />
        <Text>079 7777 885</Text>
      </Group>
      <Text weight={700} size="lg" style={{ margin: '1rem 0 1rem 0' }}>
        6. Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu cá nhân của mình
      </Text>
      <Text>
        <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> không thu thập thông tin
        khách hàng qua trang web, thông tin cá nhân khách hàng được thực hiện thu thập qua email
        liên hệ đặt mua sản phẩm, dịch vụ gửi về hộp mail của chúng tôi: Booking@gmail.com hoặc số
        điện thoại liên hệ đặt mua sản phẩm gọi về <strong> 079 7777 885 </strong>
      </Text>
      <Text>
        Bạn có thể liên hệ địa chỉ email cùng số điện thoại trên để yêu cầu{' '}
        <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> chỉnh sửa dữ liệu cá nhân
        của mình.
      </Text>
      <Text weight={700} size="lg" style={{ margin: '1rem 0 1rem 0' }}>
        7. Cơ chế tiếp nhận và giải quyết khiếu nại của người tiêu dùng liên quan đến việc thông tin
        cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo.
      </Text>
      <Text>
        Tại <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> , việc bảo vệ thông
        tin cá nhân của bạn là rất quan trọng, bạn được đảm bảo rằng thông tin cung cấp cho chúng
        tôi sẽ được mật <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> cam kết
        không chia sẻ, bán hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ người nào khác.
        <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> cam kết chỉ sử dụng các
        thông tin của bạn vào các trường hợp sau:
      </Text>
      <ul>
        <li>Nâng cao chất lượng dịch vụ dành cho khách hàng</li>
        <li>Giải quyết các tranh chấp, khiếu nại</li>
        <li>Khi cơ quan pháp luật có yêu cầu.</li>
      </ul>
      <Text>
        <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> hiểu rằng quyền lợi của
        bạn trong việc bảo vệ thông tin cá nhân cũng chính là trách nhiệm của chúng tôi nên trong
        bất kỳ trường hợp có thắc mắc, góp ý nào liên quan đến chính sách bảo mật của{' '}
        <strong style={{ color: '#00c169' }}> Trebaybooking.com </strong> , và liên quan đến việc
        thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo vui lòng liên hệ qua:
        <Text>
          số hotline <strong> 079 7777 885 </strong> hoặc email:{' '}
          <strong> booking@gmail.com </strong>
        </Text>
      </Text>
    </Card>
  );
};

export default InformationPrivacyPolicy;
