export const baseFormInputProps = [
  {
    label: "Tên",
    inputProps: "name",
    placeholder: "Nhập tên",
  },
  {
    label: "Địa chỉ",
    inputProps: "address",
    placeholder: "Nhập địa chỉ",
  },
  // {
  //   label: "Tỉ lệ tiền cọc",
  //   inputProps: "deposit",
  //   placeholder: "Nhập tỉ lệ tiền cọc",
  // },
];
export const contactInfoProps = [
  {
    label: 'Liên hệ',
    inputProps: 'needToContact',
    placeholder: '',
  },
  {
    // label: 'Thông tin liên hệ',
    inputProps: 'contactInfor',
    placeholder: 'Nhập thông tin liên hệ',
  },
];

export const hotelFormInputProps = [
  {
    label: "Ưu đãi",
    inputProps: "promotionDescription",
    placeholder: "Nhập ưu đãi cho khách sạn",
  },
  {
    label: "Số phòng tối đa một đơn theo ngày",
    inputProps: "dayOrderMaxRoom",
    placeholder: "Nhập số phòng tối đa",
  },
];

export const villaFormInputProps = [
  {
    label: "Số lượng khách",
    inputProps: "numberOfCustomer",
    placeholder: "Nhập số lượng khách",
  },
  {
    label: "Giá",
    inputProps: "price",
    placeholder: "Nhập giá (VND)",
  },
];

export const townhouseFormInputProps = [
  {
    label: "Số lượng khách",
    inputProps: "numberOfCustomer",
    placeholder: "Nhập số lượng khách",
  },
  {
    label: "Giá",
    inputProps: "price",
    placeholder: "Nhập giá (VND)",
  },
];

export const roomFormInputProps = [
  {
    label: "Số phòng",
    inputProps: "roomNo",
    placeholder: "Nhập số phòng",
  },
  {
    label: "Số giường",
    inputProps: "numberOfBed",
    placeholder: "Nhập số giường",
  },
  {
    label: "Giá phòng - theo ngày",
    inputProps: "dayPrice",
    placeholder: "Nhập giá phòng theo ngày",
  },
];

export const accountFormInputProps = {
  ROLE_USER: "Khách hàng",
  ROLE_ADMIN: "Quản trị viên",
  ROLE_STAFF: "Nhân viên",
  ROLE_STAFF_COLLABORATOR: "Nhân viên đối tác",
  ROLE_COLLABORATOR: "Cộng tác viên",
};

export const ORDER_TYPE = {
  0: "hour",
  1: "day",
};

export const ORDER_TYPE_VALUE = {
  hour: 0,
  day: 1,
};

export const percentInputProps = {
  precision: 2,
  min: 0,
  step: 0.5,
  max: 100,
};
