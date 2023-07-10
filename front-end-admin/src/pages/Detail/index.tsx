import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Tabs, Space, Text, Group, Button } from '@mantine/core';

import Layout from '@/components/Layout';
import TreBookingForm from '@/components/TreBookingForm';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { VillaProps } from '@/utils/types';

export default function DetailPage() {
  // const [activeTab, setActiveTab] = useState<string | null>('first');
  // const location = useLocation();
  // const { action }: { action: string } = location.state ? location.state : '';
  // const isCreating: boolean = action === 'new';
  // const isUpdating: boolean = action === 'update';

  // const form = useForm<VillaProps>({
  //   initialValues: isCreating
  //     ? {
  //       id: '',
  //       name: '',
  //       address: '',
  //       images: [],
  //       description: '',
  //       numOfCustomers: undefined,
  //       price: undefined,
  //       totalRoom: undefined,
  //       available: false,
  //       promotion: undefined,
  //     }
  //     : {
  //       id: '1',
  //       name: 'Khách sạn ngàn sao',
  //       address: '123 Vũng tàu',
  //       images: [
  //         'https://a0.muscache.com/im/pictures/e25a9b25-fa98-4160-bfd1-039287bf38b6.jpg?im_w=720',
  //         'https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg',
  //         'https://kienviet.net/wp-content/uploads/2020/04/TRC_2122-copy.jpg',
  //         'https://kienviet.net/wp-content/uploads/2020/04/DJI_0169-copy.jpg',
  //         'https://kienviet.net/wp-content/uploads/2020/04/TRC_2079-Pano-copy.jpg',
  //         'https://kienviet.net/wp-content/uploads/2020/04/DJI_0169-copy.jpg',
  //         'https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg',
  //         'https://kienviet.net/wp-content/uploads/2020/04/TRC_1778.jpg',
  //         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0joKyz3ZtSKu--ncNv9Gr6KdwJntpTqJHWw&usqp=CAU',
  //       ],
  //       description:
  //         'Hãy thư giãn tại địa điểm nghỉ dưỡng độc đáo và yên tĩnh này. Với một sảnh chung, khu vườn và tầm nhìn ra sông, chỗ ở nằm ở Tabanan, cách Đền Taman Ayun 12 km. Nổi bật với các phòng gia đình, chỗ ở này còn mang đến cho khách một sân thượng thoáng mát. Chỗ ở có bếp chung và dịch vụ phòng cho khách. Khu vực này phổ biến cho câu cá và có dịch vụ thuê xe hơi.Điểm đặc biệt & sẽ thật tuyệt vời hơn khi mỗi buổi sáng được đánh thức bởi tiếng sóng rì rào của biển khơi. Bạn sẽ có cảm giác như đang lạc vào chốn thiên đường nơi tránh xa những mệt mỏi ồn ào của phố thị chật chội. Với kinh nghiệm quản lý và vận hành chuyên nghiệp Hệ thống biệt thự nghỉ dưỡng tại Vũng Tàu cùng với đội ngũ nhân viên nhiệt tình và tận tâm, chúng tôi luôn nỗ lực hết mình để mang đến cho quý khách hàng những căn biệt thự nghỉ dưỡng tốt nhất. Hãy thư giãn tại địa điểm nghỉ dưỡng độc đáo và yên tĩnh này. Với một sảnh chung, khu vườn và tầm nhìn ra sông, chỗ ở nằm ở Tabanan, cách Đền Taman Ayun 12 km. Nổi bật với các phòng gia đình, chỗ ở này còn mang đến cho khách một sân thượng thoáng mát. Chỗ ở có bếp chung và dịch vụ phòng cho khách. Khu vực này phổ biến cho câu cá và có dịch vụ thuê xe hơi.Điểm đặc biệt & sẽ thật tuyệt vời hơn khi mỗi buổi sáng được đánh thức bởi tiếng sóng rì rào của biển khơi. Bạn sẽ có cảm giác như đang lạc vào chốn thiên đường nơi tránh xa những mệt mỏi ồn ào của phố thị chật chội. Với kinh nghiệm quản lý và vận hành chuyên nghiệp Hệ thống biệt thự nghỉ dưỡng tại Vũng Tàu cùng với đội ngũ nhân viên nhiệt tình và tận tâm, chúng tôi luôn nỗ lực hết mình để mang đến cho quý khách hàng những căn biệt thự nghỉ dưỡng tốt nhất. Hãy thư giãn tại địa điểm nghỉ dưỡng độc đáo và yên tĩnh này. Với một sảnh chung, khu vườn và tầm nhìn ra sông, chỗ ở nằm ở Tabanan, cách Đền Taman Ayun 12 km. Nổi bật với các phòng gia đình, chỗ ở này còn mang đến cho khách một sân thượng thoáng mát. Chỗ ở có bếp chung và dịch vụ phòng cho khách. Khu vực này phổ biến cho câu cá và có dịch vụ thuê xe hơi.Điểm đặc biệt & sẽ thật tuyệt vời hơn khi mỗi buổi sáng được đánh thức bởi tiếng sóng rì rào của biển khơi. Bạn sẽ có cảm giác như đang lạc vào chốn thiên đường nơi tránh xa những mệt mỏi ồn ào của phố thị chật chội. Với kinh nghiệm quản lý và vận hành chuyên nghiệp Hệ thống biệt thự nghỉ dưỡng tại Vũng Tàu cùng với đội ngũ nhân viên nhiệt tình và tận tâm, chúng tôi luôn nỗ lực hết mình để mang đến cho quý khách hàng những căn biệt thự nghỉ dưỡng tốt nhất. Hãy thư giãn tại địa điểm nghỉ dưỡng độc đáo và yên tĩnh này. Với một sảnh chung, khu vườn và tầm nhìn ra sông, chỗ ở nằm ở Tabanan, cách Đền Taman Ayun 12 km. Nổi bật với các phòng gia đình, chỗ ở này còn mang đến cho khách một sân thượng thoáng mát. Chỗ ở có bếp chung và dịch vụ phòng cho khách. Khu vực này phổ biến cho câu cá và có dịch vụ thuê xe hơi.Điểm đặc biệt & sẽ thật tuyệt vời hơn khi mỗi buổi sáng được đánh thức bởi tiếng sóng rì rào của biển khơi. Bạn sẽ có cảm giác như đang lạc vào chốn thiên đường nơi tránh xa những mệt mỏi ồn ào của phố thị chật chội. Với kinh nghiệm quản lý và vận hành chuyên nghiệp Hệ thống biệt thự nghỉ dưỡng tại Vũng Tàu cùng với đội ngũ nhân viên nhiệt tình và tận tâm, chúng tôi luôn nỗ lực hết mình để mang đến cho quý khách hàng những căn biệt thự nghỉ dưỡng tốt nhất.',
  //       totalRoom: 5,
  //       numOfCustomers: 5,
  //       price: 200000,
  //       surchargeFee: 10,
  //       depositPrice: 10,
  //       cancelFee: 10,
  //       available: false,
  //       promotion: undefined,
  //     },
  //   validate: {
  //     name: (value: string) => (value.length < 1 ? 'Không được để trống tên' : null),
  //     description: (value: string) => (value.length < 1 ? 'Không được để trống mô tả' : null),
  //     address: (value: string) => (value.length < 1 ? 'Không được để trống địa chỉ' : null),
  //   },
  // });

  // React.useEffect(() => {
  //   (isCreating || isUpdating) && setActiveTab('second');
  // }, []);

  return (
    <></>
    // <Container fluid>
    //   <Space h="sm" />
    //   <Tabs color="teal" defaultValue="first" value={activeTab} onTabChange={setActiveTab}>
    //     <Tabs.List style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white' }}>
    //       <Group style={{ width: '60%' }}>
    //         {!isCreating ? (
    //           <React.Fragment>
    //             <Tabs.Tab value="first">
    //               <Text size="md" color={activeTab === 'first' ? undefined : 'dimmed'}>
    //                 Xem chi tiết
    //               </Text>
    //             </Tabs.Tab>
    //             <Tabs.Tab value="second">
    //               <Text size="md" color={activeTab === 'second' ? undefined : 'dimmed'}>
    //                 Chỉnh sửa
    //               </Text>
    //             </Tabs.Tab>
    //             <Tabs.Tab value="third">
    //               <Text size="md" color={activeTab === 'third' ? undefined : 'dimmed'}>
    //                 Thông tin khách thuê
    //               </Text>
    //             </Tabs.Tab>
    //           </React.Fragment>
    //         ) : (
    //           <Tabs.Tab value="second">
    //             <Text size="md" color={activeTab === 'second' ? undefined : 'dimmed'}>
    //               Thêm mới
    //             </Text>
    //           </Tabs.Tab>
    //         )}
    //       </Group>
    //       {form.isDirty() ? (
    //         <Group style={{ width: '40%' }} position="right" pr={20}>
    //           <Button color="teal" variant="outline" onClick={() => form.reset()}>
    //             Hủy thay đổi
    //           </Button>
    //           <Button color="teal">Lưu thay đổi</Button>
    //         </Group>
    //       ) : null}
    //     </Tabs.List>

    //     {!isCreating ? (
    //       <Tabs.Panel value="first">
    //         <></>
    //       </Tabs.Panel>
    //     ) : null}

    //     <Tabs.Panel value="second" pt="xs">
    //       <TreBookingForm assetType="villa" />
    //     </Tabs.Panel>
    //   </Tabs>
    //   <Space h="sm" />
    // </Container>
  );
}
