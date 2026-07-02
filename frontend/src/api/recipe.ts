import { get, del } from './request';
import type { RecipeDoc } from '@/types';

export function fetchRecipes(): Promise<RecipeDoc[]> {
  return get<RecipeDoc[]>('/recipes');
}

export function deleteRecipe(id: string): Promise<null> {
  return del<null>(`/recipes/${id}`);
}
