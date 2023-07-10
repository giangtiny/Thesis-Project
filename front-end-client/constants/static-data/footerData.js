import { Group, Text, Grid } from '@mantine/core';
import {
  IconMail,
  IconMapPins,
  IconPhoneCall,
  IconFileCertificate,
  IconBuildingSkyscraper
} from '@tabler/icons';

export const footerData = [
  {
    title: 'Về Tre Booking',
    links: [
      {
        label: 'Về chúng tôi',
        link: '/about',
        disabled: false
      },
      {
        label: 'Trợ giúp',
        link: '/',
        disabled: false
      },
      {
        label: 'Quy chế hoạt động',
        link: '/',
        disabled: false
      },
      {
        label: 'Cách đặt chỗ',
        link: '/',
        disabled: false
      },
      {
        label: 'Chính sách thanh toán',
        link: '/policies/0',
        disabled: false
      },
      {
        label: 'Chính sách xử lý khiếu nại',
        link: '/policies/1',
        disabled: false
      },
      {
        label: 'Chính đổi trả và hoàn tiền',
        link: '/policies/2',
        disabled: false
      },
      {
        label: 'Chính sách bảo mật thông tin',
        link: '/policies/3',
        disabled: false
      }
    ]
  },
  {
    title: 'Sản phẩm',
    links: [
      {
        label: 'Villa',
        link: '/',
        disabled: false
      },
      {
        label: 'Nhà phố',
        link: '/',
        disabled: false
      },
      {
        label: 'Khách sạn',
        link: '/',
        disabled: false
      }
    ]
  },
  {
    title: 'Liên hệ',
    links: [
      {
        label: (
          <Group>
            <IconBuildingSkyscraper />
            <Text>Công ty TNHH Thương mại Dịch vụ Du lịch Tre Bay</Text>
          </Group>
        ),
        link: '',
        disabled: true
      },
      {
        label: (
          <Group>
            <IconFileCertificate />
            <Text>GPKD số 3502487093 do Sở KH và ĐT TP Vũng Tàu cấp ngày 24/10/2022</Text>
          </Group>
        ),
        link: '',
        disabled: true
      },
      {
        label: (
          <Group>
            <IconMapPins />
            <Text>Số 25/1, Thùy Vân, Phường 2 , TP. Vũng Tàu</Text>
          </Group>
        ),
        link: '',
        disabled: true
      },
      {
        label: (
          <Group>
            <IconMail />
            <Text>booking@gmail.com</Text>
          </Group>
        ),
        link: '',
        disabled: true
      },
      {
        label: (
          <Group>
            <IconPhoneCall />
            <Text>079 7777 885</Text>
          </Group>
        ),
        link: '',
        disabled: true
      }
    ]
  }
];

export const COPY_RIGHT_TEXT = '© 2022 HCMUT/E. All rights reserved.';

export const FOLLOW_US_TEXT = 'Theo dõi chúng tôi trên: ';
