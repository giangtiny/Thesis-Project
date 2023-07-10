export interface IOrderDataTable {
  name: string;
  quantity: number;
  price: number;
}

export interface IRoomInvoiceDetail {
  roomNo: string;
  roomPrice: number;
}

export interface IUserInfo {
  userID?: string;
  userName: string;
  phoneNumber: string;
  gmail?: string;
}

export interface IOrderDetail extends IUserInfo {
  id?: string;
  numberOfCustomer: number;
  paidDeposit?: number;
  mustPayDeposit?: number;
  deposit?: number;
  orderType: 0 | 1;
  checkIn: string | null;
  checkOut?: string | null;
  vat: number;
  promotion?: number;
  roomSurcharges: IOrderDataTable[];
  surcharges: IOrderDataTable[];
  roomInvoiceDetails?: IRoomInvoiceDetail[];
  hotelID: string;
  villaID: string;
  townhouseID: string;
  roomIDs: string[];
  maxHour?: number;
  isFullyPaid?: boolean;
  isGroupOrder?: boolean;
  typeOfDiscount: 0 | 1;
  discountInPercentage?: number;
  discountInCash?: number;
  remain?: number;
  vatInPrice?: number;
  numHourPassed?: string;
  createdBy?: string;
}

export interface IInvoiceDetail extends IUserInfo {
  orderCode: string;
  mustPayDeposit?: number;
  paidDeposit?: number;
  discount: number;
  discountType?: 0 | 1;
  fee?: number;
  orderType?: 0 | 1 | 2;
  promotion?: number;
  roomInvoiceSurCharges?: IOrderDataTable[];
  villaTownhouseInvoiceSurCharge?: IOrderDataTable[];
  nameOfVillaTownhouse?: string;
  idOfVillaTownhouse?: string;
  address: string;
  phoneNumberOfBusiness?: string;
  price?: number;
  totalPrice: number;
  totalSurCharge?: number;
  remain?: number;
  vat: number;
  vatInPrice: number;
  vatPercentage?: number;
  totalTime: number;
  numHourPassed?: string;
}

export interface IOrderHourPolicy {
  fee: number;
  hour: number;
}

export interface IOrderType {
  0: 'hour';
  1: 'day';
}
