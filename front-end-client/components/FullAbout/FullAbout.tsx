import { Text, Title, Divider, List, Avatar, Button, Group, Paper } from '@mantine/core';
import { Logo } from '../../icons/index';
import { useFullAboutStyle } from './FullAbout.style';
const FullAbout = () => {
  const { classes } = useFullAboutStyle();
  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <Paper radius="lg">
        <Title order={1} align="center">
          TRE BAY
        </Title>
        <Text align="center" style={{ marginBottom: 30 }}>
          “Trải nghiệm Vũng Tàu theo cách riêng của bạn”
        </Text>
        <Divider variant="dashed" />
        <Text style={{ marginTop: 30 }}>
          Tre Bay là dịch vụ chuyên đặt phòng Khách sạn, Homestay, Căn hộ, Villa, ...trực tuyến cho
          Quý khách hàng đang có nhu cầu lưu trú tại Vũng Tàu. Chúng tôi tập trung vào việc đảm bảo
          giá tốt nhất, dịch vụ thuận tiện nhất và cung cấp những thông tin đa chiều khách quan nhất
          cho Quý khách hàng về khách sạn Vũng Tàu và các dịch vụ nghỉ dưỡng đi kèm.
        </Text>
        <Text style={{ marginTop: 30 }}>
          Áp dụng việc đặt phòng tiến bộ theo công nghệ thông tin, Tre Bay với mong muốn mang đến
          cho Quý khách một trải nghiệm hoàn toàn khác - Thú vị hơn cũng như thuận tiện và đơn giản
          trong việc đặt phòng cho chuyến du lịch hoặc công tác trở nên ý nghĩa và diễn ra suôn sẻ
          nhất.
        </Text>
        <Text style={{ marginTop: 30 }}>
          Trước đây, nếu Quý khách có nhu cầu đặt phòng phải đến trực tiếp hoặc làm việc với các
          công ty lữ hành để đặt phòng, hay đặt theo tour của chuyến du lịch thì với dịch vụ bên Tre
          Bay, quý khách có thể lựa chọn thoải mái phòng và các dịch vụ đi kèm trên chính website
          này một cách thuận tiện, không phải phụ thuộc vào các đơn vị lữ hành.
        </Text>
        <Text style={{ marginTop: 30 }}>
          Tre Bay tin rằng hạnh phúc có thể đến dưới nhiều hình thức đối với những người khác nhau
          trong những thời điểm khác nhau. Vì vậy, với uy tín của chúng tôi và kinh nghiệm nhiều năm
          trong nghề, chúng tôi hứa hẹn với bạn một loạt các lựa chọn phong phú để thắp sáng trạng
          thái hạnh phúc của chính bạn. Nếu bạn đang tìm kiếm địa chỉ Dịch vụ lưu trú hàng đầu tại
          Vũng Tàu, có thể liên hệ ngay <strong>Melissa Hotel Vũng Tàu</strong> thuộc công ty Tre
          Bay, tại đây chuyên cung cấp Căn Hộ/Khách sạn đến Quý khách hàng.
        </Text>

        <Title style={{ marginTop: 30 }}>Tầm nhìn:</Title>
        <Text style={{ marginTop: 30 }}>
          Dù bạn muốn ở tại một căn hộ thanh lịch trong thành phố, một resort sang trọng ven biển
          hay một nhà nghỉ B&B ấm cúng tại vùng quê, Tre Bay đều có thể cung cấp cho bạn vô số lựa
          chọn phong phú - Tất cả trong cùng một nơi.
        </Text>

        <Title style={{ marginTop: 30 }}>Sứ mệnh:</Title>
        <Text style={{ marginTop: 30 }}>
          Khi đến với Tre Bay, chúng tôi tin rằng mọi chỗ nghỉ tuyệt vời đều xứng đáng được du khách
          biết tới. Đó là vì sao chúng tôi tạo điều kiện cho các nhà cung cấp chỗ nghỉ tại Vũng Tàu
          tiếp thị chỗ nghỉ của họ, tiếp cận khách hàng mới và phát triển hoạt động kinh doanh thông
          qua kênh do chúng tôi tạo ra.
        </Text>

        <Title style={{ marginTop: 30 }}>Những điểm nổi bật của Melissa Hotel</Title>
        <Text style={{ marginTop: 30 }}>Những điểm nổi bật của Melissa Hotel</Text>
        <List style={{ marginBottom: 30 }}>
          <List.Item style={{ marginTop: 10 }}>
            Mỗi phòng nghỉ đều được trang bị máy lạnh, các phòng đều có ban công, khu vực tiếp khách
            với ghế sofa, TV truyền hình cáp màn hình phẳng và tủ quần áo. Quý khách có thể truy cập
            Wifi miễn phí ở các khu vực chung. Minibar , trà/cà phê cũng được trang bị trong phòng
            nhằm mang lại sự thuận tiện cho du khách. Bên cạnh đó còn có khu vực ăn uống với bàn ăn.
            Phòng tắm riêng trong mỗi phòng đều đi kèm vòi sen, máy sấy tóc, khăn tắm, dép và đồ vệ
            sinh cá nhân miễn phí để tạo sự thoải mái cho khách.
          </List.Item>
          <List.Item style={{ marginTop: 10 }}>
            Khách sạn có quầy lễ tân 24 giờ với các nhân viên để hỗ trợ khách thu xếp các dịch vụ và
            trợ giúp đặc biệt khác.
          </List.Item>
          <List.Item style={{ marginTop: 10 }}>
            Với dịch vụ chăm sóc khách hàng 24/7 cũng như nhiều phương thức thanh toán trực tuyến
            thuận tiện. Melissa Hotel được +200 khách hàng lựa chọn địa điểm lưu trú khi đến với
            Vũng Tàu, kèm với đó là nhiều phản hồi tích cực về việc cung cấp dịch vụ lưu trú.
          </List.Item>
        </List>
        <Divider variant="dashed" />
        <Title style={{ marginTop: 30 }}>Liên hệ với Tre Bay:</Title>
        <Group position="center" style={{ marginTop: 20 }}>
          <Logo className={classes.logo}></Logo>
          <div style={{ marginLeft: 20 }}>
            <Title order={3}>Công ty TNHH Thương Mại Dịch Vụ Du Lịch Tre Bay</Title>
            <Text>
              Địa chỉ: Số 25/1, Thùy Vân, Phường 2, TP. Vũng Tàu
              <br />
              Mail: booking@gmail.com
              <br />
              Hotline: 079 7777 885
              <br />
              Website: http://trebaybooking.com/
            </Text>
          </div>
        </Group>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
          <Button
            color="teal"
            size="lg"
            variant="outline"
            component="a"
            href="http://trebaybooking.com/products">
            Đặt phòng ngay
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default FullAbout;
