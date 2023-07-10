import queryString from 'query-string';
import client from './client';
import { NewsDetailDto } from '@/utils/types';

class NewsApi {
  public static classInstance: NewsApi;

  static get instance() {
    if (!this.classInstance) {
      this.classInstance = new NewsApi();
    }

    return this.classInstance;
  }

  public getAllNews(): Promise<NewsDetailDto[]> {
    return client.get(`/news/all`);
  }

  public getNewsByPage(query: { offset?: number; maxPerPage?: number }): Promise<any> {
    return client.get(`/news/paged?${queryString.stringify(query)}`);
  }

  public getNewsById(newsId: string): Promise<any> {
    return client.get(`/news/${newsId}`);
  }
}

export default NewsApi.instance;
