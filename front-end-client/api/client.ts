import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';
import config from '@/config/config';

declare module 'axios' {
  // interface AxiosResponse<T> extends Promise<T> {};
}

class Client {
  public static classInstance?: Client;
  protected axiosInstance: AxiosInstance;

  public constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.API_HOST
    });
    this.axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  public static get instance() {
    if (!this.classInstance) {
      this.classInstance = new Client();
    }

    return this.classInstance;
  }

  private _initializeRequestInterceptor = () => {
    this.axiosInstance.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken && config.headers) {
          (config.headers as AxiosHeaders).set(
            'Authorization',
            `Bearer ${JSON.parse(accessToken)}`
          );
        }
      }

      return config;
    });
  };

  private _initializeResponseInterceptor = () => {
    this.axiosInstance.interceptors.response.use(this._handleResponse, this._handleError);
  };
  private _handleResponse = ({ data }: any) => {
    return data;
  };

  protected _handleError = async (error: AxiosError) => {
    if (!error.response && !error.request) {
      return Promise.reject(error);
    } else if (!error.response && error.request) {
      return Promise.reject({ message: 'No response received' });
    } else if (error.response) {
      return Promise.reject(error.response);
    }
  };

  public get<T = unknown, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.get(url, config);
  }

  public delete<T = unknown, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.delete(url, config);
  }

  public post<T = unknown, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.post(url, data, config);
  }

  public put<T = unknown, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.put(url, data, config);
  }

  public patch<T = unknown, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.patch(url, data, config);
  }
}

export default Client.instance;
