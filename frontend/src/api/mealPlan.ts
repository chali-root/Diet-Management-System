import { get, post, del } from './request';
import type { GeneratedPlan, MealHistoryRecord } from '@/types';

export function generateMealPlan(config: Record<string, unknown>): Promise<GeneratedPlan> {
  return post<GeneratedPlan>('/meal-plan/generate', config);
}

export function saveMealPlan(plan: GeneratedPlan): Promise<MealHistoryRecord> {
  return post<MealHistoryRecord>('/meal-plan/save', plan);
}

export function fetchMealHistory(): Promise<MealHistoryRecord[]> {
  return get<MealHistoryRecord[]>('/meal-plan/history');
}

export function deleteMealHistory(id: string): Promise<null> {
  return del<null>(`/meal-plan/history/${id}`);
}
