import { post } from './request';
import type { UserInfo, LoginParams, ChangePwdParams } from '@/types';

export function loginApi(params: LoginParams): Promise<UserInfo> {
  return post<UserInfo>('/user/login', params);
}

export function changePwdApi(params: ChangePwdParams): Promise<null> {
  return post<null>('/user/change-pwd', params);
}
