import queryString from 'query-string';
import client from './client';
import { Hotels } from '@/utils/types';

class HotelApi {
  public static classInstance: HotelApi;

  static get instance() {
    if (!this.classInstance) {
      this.classInstance = new HotelApi();
    }

    return this.classInstance;
  }

  public getAllHotels(): Promise<Hotels> {
    return client.get(`/hotel/all`);
  }

  public getHotelsByPage(query: { offset?: number; maxPerPage?: number }): Promise<any> {
    return client.get(`/hotel/paged?${queryString.stringify(query)}`);
  }

  public getHotelById(hotelId: string): Promise<any> {
    return client.get(`/hotel/${hotelId}`);
  }

  public getAllCommentOfHotel(hotelId: string): Promise<any> {
    return client.get(`/comment/all/detail?id=${hotelId}`);
  }
}

export default HotelApi.instance;
