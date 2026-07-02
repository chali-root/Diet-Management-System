import { get, post } from './request';
import type { DietConfig } from '@/types';

export function fetchDietConfig(): Promise<DietConfig> {
  return get<DietConfig>('/diet-config');
}

export function saveDietConfig(data: DietConfig): Promise<DietConfig> {
  return post<DietConfig>('/diet-config', data);
}
