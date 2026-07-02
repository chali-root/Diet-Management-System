/* 菜谱文档 */
export interface RecipeDoc {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'txt';
  fileSize: number;
  uploadTime: string;
}

/* 饮食忌口 */
export type Restriction = 'noSpicy' | 'noOnionGinger' | 'vegetarian' | 'noSeafood' | 'lowSugar';

/* 饮食目标 */
export type DietGoal = 'homeCook' | 'fatLoss' | 'stomach' | 'muscleGain';

/* 饮食配置 */
export interface DietConfig {
  ingredients: string;
  restrictions: Restriction[];
  goal: DietGoal;
}

/* 配餐中的单道菜 */
export interface MealItem {
  id: string;
  name: string;
  isExisting: boolean;
  ingredients: string[];
}

/* 一天的餐食 */
export interface DayMeal {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
}

/* 采购清单项 */
export interface ShoppingItem {
  name: string;
  amount: string;
  category: string;
}

/* AI 生成的配餐方案 */
export interface GeneratedPlan {
  id: string;
  days: DayMeal[];
  shoppingList: ShoppingItem[];
  generatedAt: string;
  dietGoal: DietGoal;
}

/* 历史记录 */
export interface MealHistoryRecord {
  id: string;
  plan: GeneratedPlan;
  savedAt: string;
  config: DietConfig;
}

/* 用户 */
export interface UserInfo {
  id: string;
  username: string;
  token: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface ChangePwdParams {
  oldPassword: string;
  newPassword: string;
}

/* API 通用响应 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
