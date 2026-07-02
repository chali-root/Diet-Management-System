import axios, { AxiosRequestConfig } from 'axios';
import { Toast } from 'antd-mobile';

let loadingCount = 0;
let loadingHandler: (() => void) | null = null;

export function setLoadingHandler(handler: () => void) {
  loadingHandler = handler;
}

function showLoading() {
  loadingCount++;
  loadingHandler?.();
}

function hideLoading() {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0) {
    loadingHandler?.();
  }
}

const TOKEN_KEY = 'diet_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

const instance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

/* 请求拦截器：注入 token + 触发 loading */
instance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.headers?.['X-No-Loading'] !== 'true') {
      showLoading();
    }
    return config;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  },
);

/* 响应拦截器：隐藏 loading + 统一错误 + 401 处理 */
instance.interceptors.response.use(
  (response) => {
    hideLoading();
    const { data } = response;
    if (data.code !== 0 && data.code !== 200) {
      Toast.show({ content: data.message || '请求失败', icon: 'fail' });
      return Promise.reject(new Error(data.message));
    }
    return data;
  },
  (error) => {
    hideLoading();
    if (error.response?.status === 401) {
      clearStoredToken();
      localStorage.removeItem('diet_user');
      Toast.show({ content: '登录已过期，请重新登录', icon: 'fail' });
      window.location.hash = '#/login';
      return Promise.reject(error);
    }
    const msg =
      error.response?.data?.message || error.message || '网络异常，请重试';
    Toast.show({ content: msg, icon: 'fail' });
    return Promise.reject(error);
  },
);

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await instance.get<unknown, { code: number; message: string; data: T }>(url, { params });
  return res.data;
}

export async function post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await instance.post<unknown, { code: number; message: string; data: T }>(url, body, config);
  return res.data;
}

export async function del<T>(url: string): Promise<T> {
  const res = await instance.delete<unknown, { code: number; message: string; data: T }>(url);
  return res.data;
}

export function uploadFile<T>(url: string, file: File, fieldName = 'file'): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);
  showLoading();
  return instance
    .post<unknown, { code: number; message: string; data: T }>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
    .finally(() => hideLoading());
}

export default instance;
