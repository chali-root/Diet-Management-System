import { create } from 'zustand';
import type {
  RecipeDoc,
  DietConfig,
  Restriction,
  DietGoal,
  GeneratedPlan,
  MealHistoryRecord,
  UserInfo,
  LoginParams,
} from '@/types';
import { DEFAULT_DIET_CONFIG } from '@/utils/constants';
import { setStoredToken, clearStoredToken } from '@/api/request';

/* ---------- Mock 数据 ---------- */
const mockRecipeDocs: RecipeDoc[] = [
  { id: 'd1', fileName: '家常红烧肉.pdf', fileType: 'pdf', fileSize: 245000, uploadTime: '2025-06-28T10:30:00' },
  { id: 'd2', fileName: '减脂餐食谱合集.txt', fileType: 'txt', fileSize: 12800, uploadTime: '2025-06-29T14:20:00' },
  { id: 'd3', fileName: '粤菜老火汤大全.pdf', fileType: 'pdf', fileSize: 1800000, uploadTime: '2025-06-30T09:15:00' },
];

const mockWeekHistory: MealHistoryRecord[] = [
  { id: 'h1', savedAt: '2025-06-25T08:00:00', config: DEFAULT_DIET_CONFIG, plan: { id: 'p1', generatedAt: '2025-06-25T07:58:00', dietGoal: 'homeCook', days: [], shoppingList: [] } },
  { id: 'h2', savedAt: '2025-06-26T08:00:00', config: { ...DEFAULT_DIET_CONFIG, goal: 'fatLoss' }, plan: { id: 'p2', generatedAt: '2025-06-26T07:55:00', dietGoal: 'fatLoss', days: [], shoppingList: [] } },
  { id: 'h3', savedAt: '2025-06-27T08:00:00', config: DEFAULT_DIET_CONFIG, plan: { id: 'p3', generatedAt: '2025-06-27T07:50:00', dietGoal: 'homeCook', days: [], shoppingList: [] } },
  { id: 'h4', savedAt: '2025-06-28T08:00:00', config: { ...DEFAULT_DIET_CONFIG, goal: 'muscleGain' }, plan: { id: 'p4', generatedAt: '2025-06-28T07:45:00', dietGoal: 'muscleGain', days: [], shoppingList: [] } },
  { id: 'h5', savedAt: '2025-06-29T08:00:00', config: DEFAULT_DIET_CONFIG, plan: { id: 'p5', generatedAt: '2025-06-29T07:40:00', dietGoal: 'homeCook', days: [], shoppingList: [] } },
  { id: 'h6', savedAt: '2025-06-30T08:00:00', config: { ...DEFAULT_DIET_CONFIG, goal: 'fatLoss' }, plan: { id: 'p6', generatedAt: '2025-06-30T07:35:00', dietGoal: 'fatLoss', days: [], shoppingList: [] } },
  { id: 'h7', savedAt: '2025-07-01T08:00:00', config: DEFAULT_DIET_CONFIG, plan: { id: 'p7', generatedAt: '2025-07-01T07:30:00', dietGoal: 'homeCook', days: [], shoppingList: [] } },
];

/* 菜品池 —— 每道菜标注与哪些忌口冲突 */
interface DishTemplate {
  name: string;
  category: 'staple' | 'meat' | 'seafood' | 'veg' | 'soup';
  conflicts: Restriction[];
  ingredients: { name: string; amount: string; cat: string }[];
}

const DISH_POOL: DishTemplate[] = [
  { name: '燕麦粥', category: 'staple', conflicts: [], ingredients: [{ name: '燕麦', amount: '100g', cat: '主食' }, { name: '牛奶', amount: '200ml', cat: '乳制品' }] },
  { name: '水煮蛋', category: 'meat', conflicts: [], ingredients: [{ name: '鸡蛋', amount: '2个', cat: '蛋类' }] },
  { name: '杂粮饭', category: 'staple', conflicts: [], ingredients: [{ name: '糙米', amount: '100g', cat: '主食' }, { name: '小米', amount: '50g', cat: '主食' }] },
  { name: '清炒时蔬', category: 'veg', conflicts: [], ingredients: [{ name: '西兰花', amount: '200g', cat: '蔬菜' }, { name: '蒜末', amount: '少许', cat: '调料' }] },
  { name: '番茄豆腐汤', category: 'soup', conflicts: [], ingredients: [{ name: '番茄', amount: '2个', cat: '蔬菜' }, { name: '嫩豆腐', amount: '1盒', cat: '豆制品' }] },
  { name: '小米粥', category: 'staple', conflicts: ['lowSugar'], ingredients: [{ name: '小米', amount: '80g', cat: '主食' }, { name: '红枣', amount: '5颗', cat: '干货' }] },
  { name: '蒸红薯', category: 'staple', conflicts: ['lowSugar'], ingredients: [{ name: '红薯', amount: '2个', cat: '蔬菜' }] },
  { name: '藜麦饭', category: 'staple', conflicts: [], ingredients: [{ name: '藜麦', amount: '100g', cat: '主食' }] },
  { name: '菌菇汤', category: 'soup', conflicts: [], ingredients: [{ name: '香菇', amount: '50g', cat: '蔬菜' }, { name: '金针菇', amount: '50g', cat: '蔬菜' }, { name: '杏鲍菇', amount: '50g', cat: '蔬菜' }] },
  { name: '白灼菜心', category: 'veg', conflicts: [], ingredients: [{ name: '菜心', amount: '300g', cat: '蔬菜' }] },
  { name: '全麦三明治', category: 'staple', conflicts: [], ingredients: [{ name: '全麦面包', amount: '2片', cat: '主食' }, { name: '鸡蛋', amount: '1个', cat: '蛋类' }, { name: '生菜', amount: '2片', cat: '蔬菜' }] },
  { name: '凉拌黄瓜', category: 'veg', conflicts: [], ingredients: [{ name: '黄瓜', amount: '2根', cat: '蔬菜' }, { name: '大蒜', amount: '2瓣', cat: '调料' }, { name: '香醋', amount: '适量', cat: '调料' }] },
  { name: '紫菜蛋花汤', category: 'soup', conflicts: [], ingredients: [{ name: '紫菜', amount: '5g', cat: '干货' }, { name: '鸡蛋', amount: '1个', cat: '蛋类' }] },
  { name: '蒜蓉菠菜', category: 'veg', conflicts: ['noOnionGinger'], ingredients: [{ name: '菠菜', amount: '300g', cat: '蔬菜' }, { name: '蒜末', amount: '1勺', cat: '调料' }] },

  { name: '鸡胸肉沙拉', category: 'meat', conflicts: ['vegetarian', 'noOnionGinger'], ingredients: [{ name: '鸡胸肉', amount: '200g', cat: '肉类' }, { name: '生菜', amount: '1颗', cat: '蔬菜' }, { name: '圣女果', amount: '100g', cat: '蔬菜' }, { name: '洋葱丝', amount: '少许', cat: '蔬菜' }] },
  { name: '清蒸鲈鱼', category: 'seafood', conflicts: ['vegetarian', 'noSeafood', 'noOnionGinger'], ingredients: [{ name: '鲈鱼', amount: '1条', cat: '水产' }, { name: '姜丝', amount: '适量', cat: '调料' }, { name: '葱段', amount: '2段', cat: '调料' }] },
  { name: '牛肉面', category: 'meat', conflicts: ['vegetarian', 'noSpicy'], ingredients: [{ name: '牛腱肉', amount: '200g', cat: '肉类' }, { name: '面条', amount: '150g', cat: '主食' }, { name: '青菜', amount: '100g', cat: '蔬菜' }] },
  { name: '香煎三文鱼', category: 'seafood', conflicts: ['vegetarian', 'noSeafood'], ingredients: [{ name: '三文鱼', amount: '200g', cat: '水产' }, { name: '柠檬', amount: '半个', cat: '水果' }] },
  { name: '红烧排骨', category: 'meat', conflicts: ['vegetarian', 'lowSugar'], ingredients: [{ name: '猪排骨', amount: '400g', cat: '肉类' }, { name: '冰糖', amount: '20g', cat: '调料' }, { name: '生抽', amount: '30ml', cat: '调料' }] },
  { name: '麻婆豆腐', category: 'veg', conflicts: ['noSpicy', 'noOnionGinger'], ingredients: [{ name: '嫩豆腐', amount: '1盒', cat: '豆制品' }, { name: '猪肉末', amount: '50g', cat: '肉类' }, { name: '花椒粉', amount: '适量', cat: '调料' }, { name: '葱花', amount: '适量', cat: '调料' }] },
  { name: '水煮肉片', category: 'meat', conflicts: ['vegetarian', 'noSpicy', 'noOnionGinger'], ingredients: [{ name: '猪里脊', amount: '300g', cat: '肉类' }, { name: '干辣椒', amount: '20g', cat: '调料' }, { name: '花椒', amount: '10g', cat: '调料' }, { name: '豆芽', amount: '200g', cat: '蔬菜' }] },
  { name: '宫保鸡丁', category: 'meat', conflicts: ['vegetarian', 'noSpicy', 'noOnionGinger'], ingredients: [{ name: '鸡胸肉', amount: '250g', cat: '肉类' }, { name: '花生米', amount: '50g', cat: '干货' }, { name: '干辣椒', amount: '10个', cat: '调料' }, { name: '葱段', amount: '2段', cat: '调料' }] },
  { name: '糖醋里脊', category: 'meat', conflicts: ['vegetarian', 'lowSugar'], ingredients: [{ name: '猪里脊', amount: '300g', cat: '肉类' }, { name: '白糖', amount: '40g', cat: '调料' }, { name: '醋', amount: '30ml', cat: '调料' }] },
  { name: '蒜蓉粉丝蒸虾', category: 'seafood', conflicts: ['vegetarian', 'noSeafood', 'noOnionGinger'], ingredients: [{ name: '大虾', amount: '300g', cat: '水产' }, { name: '粉丝', amount: '50g', cat: '干货' }, { name: '蒜末', amount: '1勺', cat: '调料' }, { name: '葱花', amount: '少许', cat: '调料' }] },
  { name: '回锅肉', category: 'meat', conflicts: ['vegetarian', 'noSpicy', 'noOnionGinger'], ingredients: [{ name: '五花肉', amount: '300g', cat: '肉类' }, { name: '蒜苗', amount: '100g', cat: '蔬菜' }, { name: '豆瓣酱', amount: '20g', cat: '调料' }, { name: '姜片', amount: '3片', cat: '调料' }] },

  { name: '番茄炒蛋', category: 'veg', conflicts: [], ingredients: [{ name: '番茄', amount: '2个', cat: '蔬菜' }, { name: '鸡蛋', amount: '3个', cat: '蛋类' }] },
  { name: '素炒三丝', category: 'veg', conflicts: [], ingredients: [{ name: '土豆', amount: '1个', cat: '蔬菜' }, { name: '胡萝卜', amount: '1根', cat: '蔬菜' }, { name: '青椒', amount: '1个', cat: '蔬菜' }] },
  { name: '香菇青菜', category: 'veg', conflicts: [], ingredients: [{ name: '上海青', amount: '300g', cat: '蔬菜' }, { name: '鲜香菇', amount: '100g', cat: '蔬菜' }] },
  { name: '冬瓜排骨汤', category: 'soup', conflicts: ['vegetarian', 'noOnionGinger'], ingredients: [{ name: '猪排骨', amount: '300g', cat: '肉类' }, { name: '冬瓜', amount: '500g', cat: '蔬菜' }, { name: '姜片', amount: '3片', cat: '调料' }, { name: '葱花', amount: '少许', cat: '调料' }] },
  { name: '南瓜小米粥', category: 'staple', conflicts: ['lowSugar'], ingredients: [{ name: '南瓜', amount: '200g', cat: '蔬菜' }, { name: '小米', amount: '80g', cat: '主食' }] },
  { name: '山药排骨汤', category: 'soup', conflicts: ['vegetarian'], ingredients: [{ name: '山药', amount: '200g', cat: '蔬菜' }, { name: '猪排骨', amount: '300g', cat: '肉类' }] },
  { name: '清炒豆苗', category: 'veg', conflicts: [], ingredients: [{ name: '豆苗', amount: '300g', cat: '蔬菜' }, { name: '蒜末', amount: '少许', cat: '调料' }] },
];

function isDishBlocked(dish: DishTemplate, restrictions: Restriction[]): boolean {
  return restrictions.some((r) => dish.conflicts.includes(r));
}

function pickDishes(pool: DishTemplate[], restrictions: Restriction[], count: number, preferExisting: boolean): DishTemplate[] {
  const available = pool.filter((d) => !isDishBlocked(d, restrictions));
  // 打乱 + 取 count 个
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.max(count, 1));
}

function buildMockPlan(config: DietConfig): GeneratedPlan {
  const { goal, restrictions } = config;
  const goalLabel = goal === 'fatLoss' ? '减脂版' : goal === 'muscleGain' ? '增肌版' : goal === 'stomach' ? '养胃版' : '家常版';

  const breakfastPool = DISH_POOL.filter((d) => d.category === 'staple' || d.name.includes('蛋'));
  const lunchPool = DISH_POOL.filter((d) => d.category === 'meat' || d.category === 'seafood' || d.category === 'veg' || d.name.includes('饭') || d.name.includes('面'));
  const dinnerPool = DISH_POOL.filter((d) => d.category === 'veg' || d.category === 'soup' || d.category === 'seafood' || d.category === 'meat');
  const dinnerStaplePool = DISH_POOL.filter((d) => d.category === 'staple');

  let idCounter = 0;
  const mkId = () => `m-${++idCounter}`;

  function toMealItem(d: DishTemplate, isExisting: boolean) {
    return {
      id: mkId(),
      name: `${goalLabel}${d.name}`,
      isExisting,
      ingredients: d.ingredients.map((i) => i.name),
    };
  }

  const days = [0, 1, 2].map(() => {
    const [bk1, bk2] = pickDishes(breakfastPool, restrictions, 2, false);
    const [lu1, lu2] = pickDishes(lunchPool, restrictions, 2, false);
    const [di1, di2] = pickDishes(dinnerPool, restrictions, 2, false);

    return {
      breakfast: [toMealItem(bk1, true), toMealItem(bk2, true)],
      lunch: [toMealItem(lu1, false), toMealItem(lu2, true)],
      dinner: [toMealItem(di1, false), toMealItem(di2, true)],
    };
  });

  // 汇总待采购食材（isExisting=false 的菜品食材）
  const purchased = new Set<string>();
  const shoppingList: { name: string; amount: string; category: string }[] = [];
  days.forEach((day) => {
    [...day.breakfast, ...day.lunch, ...day.dinner].forEach((item) => {
      if (item.isExisting) return;
      const dish = DISH_POOL.find((d) => `${goalLabel}${d.name}` === item.name);
      dish?.ingredients.forEach((ing) => {
        if (!purchased.has(ing.name)) {
          purchased.add(ing.name);
          shoppingList.push({ name: ing.name, amount: ing.amount, category: ing.cat });
        }
      });
    });
  });

  return {
    id: `plan-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    dietGoal: goal,
    days,
    shoppingList,
  };
}

/* ---------- Store ---------- */
interface AppState {
  /* 菜谱文档 */
  recipeDocs: RecipeDoc[];
  recipeLoading: boolean;
  fetchRecipes: () => Promise<void>;
  uploadRecipe: (file: File) => Promise<void>;
  deleteRecipe: (id: string) => Promise<boolean>;

  /* 饮食配置 */
  dietConfig: DietConfig;
  dietLoading: boolean;
  fetchDietConfig: () => Promise<void>;
  saveDietConfig: (config: DietConfig) => Promise<void>;
  updateDietConfig: (partial: Partial<DietConfig>) => void;
  resetDietConfig: () => void;

  /* AI 配餐方案 */
  currentPlan: GeneratedPlan | null;
  planLoading: boolean;
  generatePlan: () => Promise<void>;
  savePlan: () => Promise<void>;
  clearPlan: () => void;

  /* 历史记录 */
  mealHistory: MealHistoryRecord[];
  historyLoading: boolean;
  fetchHistory: () => Promise<void>;
  deleteHistory: (id: string) => Promise<boolean>;

  /* 用户 */
  user: UserInfo | null;
  isLoggedIn: boolean;
  login: (params: LoginParams) => Promise<boolean>;
  logout: () => void;
  updateUserInfo: (info: Partial<UserInfo>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  /* ---- 菜谱文档 ---- */
  recipeDocs: [],
  recipeLoading: false,
  fetchRecipes: async () => {
    set({ recipeLoading: true });
    try {
      // await fetchRecipesApi()
      set({ recipeDocs: [...mockRecipeDocs], recipeLoading: false });
    } catch {
      set({ recipeLoading: false });
    }
  },
  uploadRecipe: async (file: File) => {
    set({ recipeLoading: true });
    // await uploadFile('/recipes/upload', file)
    await new Promise((r) => setTimeout(r, 800));
    const doc: RecipeDoc = {
      id: `d-${Date.now()}`,
      fileName: file.name,
      fileType: file.name.endsWith('.pdf') ? 'pdf' : 'txt',
      fileSize: file.size,
      uploadTime: new Date().toISOString(),
    };
    set((s) => ({ recipeDocs: [doc, ...s.recipeDocs], recipeLoading: false }));
  },
  deleteRecipe: async (id: string) => {
    try {
      // await deleteRecipeApi(id)
      set((s) => ({ recipeDocs: s.recipeDocs.filter((d) => d.id !== id) }));
      return true;
    } catch {
      return false;
    }
  },

  /* ---- 饮食配置 ---- */
  dietConfig: DEFAULT_DIET_CONFIG,
  dietLoading: false,
  fetchDietConfig: async () => {
    set({ dietLoading: true });
    try {
      // const data = await fetchDietConfigApi()
      set({ dietLoading: false });
    } catch {
      set({ dietLoading: false });
    }
  },
  saveDietConfig: async (config: DietConfig) => {
    set({ dietLoading: true });
    // await saveDietConfigApi(config)
    await new Promise((r) => setTimeout(r, 300));
    set({ dietConfig: { ...config }, dietLoading: false });
  },
  updateDietConfig: (partial: Partial<DietConfig>) => {
    set((s) => ({ dietConfig: { ...s.dietConfig, ...partial } }));
  },
  resetDietConfig: () => {
    set({ dietConfig: { ...DEFAULT_DIET_CONFIG } });
  },

  /* ---- AI 配餐方案 ---- */
  currentPlan: null,
  planLoading: false,
  generatePlan: async () => {
    const { dietConfig } = get();
    set({ planLoading: true });
    // const plan = await generateMealPlanApi(dietConfig)
    await new Promise((r) => setTimeout(r, 1500));
    const plan = buildMockPlan(dietConfig);
    set({ currentPlan: plan, planLoading: false });
  },
  savePlan: async () => {
    const { currentPlan, dietConfig } = get();
    if (!currentPlan) return;
    // await saveMealPlanApi(currentPlan)
    await new Promise((r) => setTimeout(r, 500));
    const record: MealHistoryRecord = {
      id: `h-${Date.now()}`,
      savedAt: new Date().toISOString(),
      config: { ...dietConfig },
      plan: { ...currentPlan },
    };
    set((s) => ({ mealHistory: [record, ...s.mealHistory] }));
  },
  clearPlan: () => set({ currentPlan: null }),

  /* ---- 历史记录 ---- */
  mealHistory: [],
  historyLoading: false,
  fetchHistory: async () => {
    set({ historyLoading: true });
    // const list = await fetchMealHistoryApi()
    await new Promise((r) => setTimeout(r, 300));
    set({ mealHistory: mockWeekHistory, historyLoading: false });
  },
  deleteHistory: async (id: string) => {
    // await deleteMealHistoryApi(id)
    set((s) => ({ mealHistory: s.mealHistory.filter((h) => h.id !== id) }));
    return true;
  },

  /* ---- 用户 ---- */
  user: null,
  isLoggedIn: false,
  login: async (params: LoginParams) => {
    try {
      // const data = await loginApi(params)
      // Mock: 任意非空账号密码即可登录
      await new Promise((r) => setTimeout(r, 800));
      if (!params.username.trim() || !params.password.trim()) {
        return false;
      }
      const mockUser: UserInfo = {
        id: 'u-001',
        username: params.username,
        token: 'mock-token-' + Date.now(),
      };
      setStoredToken(mockUser.token);
      localStorage.setItem('diet_user', JSON.stringify({ id: mockUser.id, username: mockUser.username }));
      set({ user: mockUser, isLoggedIn: true });
      return true;
    } catch {
      return false;
    }
  },
  logout: () => {
    clearStoredToken();
    localStorage.removeItem('diet_user');
    set({ user: null, isLoggedIn: false });
  },
  updateUserInfo: (info: Partial<UserInfo>) => {
    set((s) => (s.user ? { user: { ...s.user, ...info } } : s));
  },
}));
