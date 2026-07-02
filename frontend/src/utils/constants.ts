import type { Restriction, DietGoal } from '@/types';

export const RESTRICTION_OPTIONS: { value: Restriction; label: string }[] = [
  { value: 'noSpicy', label: '不吃辣' },
  { value: 'noOnionGinger', label: '无葱姜' },
  { value: 'vegetarian', label: '素食' },
  { value: 'noSeafood', label: '无海鲜' },
  { value: 'lowSugar', label: '低糖' },
];

export const DIET_GOAL_OPTIONS: { value: DietGoal; label: string; desc: string }[] = [
  { value: 'homeCook', label: '家常三餐', desc: '日常家常菜搭配' },
  { value: 'fatLoss', label: '减脂餐', desc: '低脂高蛋白' },
  { value: 'stomach', label: '养胃餐', desc: '温和易消化' },
  { value: 'muscleGain', label: '增肌餐', desc: '高蛋白高碳水' },
];

export const DIET_GOAL_LABELS: Record<DietGoal, string> = {
  homeCook: '家常三餐',
  fatLoss: '减脂餐',
  stomach: '养胃餐',
  muscleGain: '增肌餐',
};

export const RESTRICTION_LABELS: Record<Restriction, string> = {
  noSpicy: '不吃辣',
  noOnionGinger: '无葱姜',
  vegetarian: '素食',
  noSeafood: '无海鲜',
  lowSugar: '低糖',
};

export const DEFAULT_DIET_CONFIG = {
  ingredients: '',
  restrictions: [] as Restriction[],
  goal: 'homeCook' as DietGoal,
};
