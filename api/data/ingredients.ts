import type { Ingredient, Level } from '../../shared/types.js';

export const INGREDIENTS: Ingredient[] = [
  { id: 'tea', name: '茶汤', icon: '🍵', unit: '克', color: '#D4A574' },
  { id: 'milk', name: '牛奶', icon: '🥛', unit: '克', color: '#FFF8E7' },
  { id: 'ice', name: '冰块', icon: '🧊', unit: '克', color: '#B3E5FC' },
  { id: 'sugar', name: '果糖', icon: '🍯', unit: '克', color: '#FFE082' },
  { id: 'boba', name: '爆珠', icon: '⚫', unit: '克', color: '#5D4037' },
  { id: 'coconut', name: '椰奶', icon: '🥥', unit: '克', color: '#F5F5F5' },
  { id: 'mango', name: '芒果酱', icon: '🥭', unit: '克', color: '#FFB74D' },
  { id: 'strawberry', name: '草莓酱', icon: '🍓', unit: '克', color: '#EF9A9A' },
  { id: 'cream', name: '奶油', icon: '🍦', unit: '克', color: '#FFF3E0' },
  { id: 'coffee', name: '咖啡液', icon: '☕', unit: '克', color: '#6D4C41' },
];

export const LEVELS: Level[] = [
  {
    id: 1,
    name: '经典珍珠奶茶',
    description: '入门关卡，调配一杯标准的珍珠奶茶',
    recipe: [
      { ingredientId: 'tea', amount: 150 },
      { ingredientId: 'milk', amount: 100 },
      { ingredientId: 'ice', amount: 80 },
      { ingredientId: 'sugar', amount: 20 },
      { ingredientId: 'boba', amount: 50 },
    ],
  },
  {
    id: 2,
    name: '冰镇柠檬茶',
    description: '清爽解腻的柠檬茶，少糖多冰',
    recipe: [
      { ingredientId: 'tea', amount: 200 },
      { ingredientId: 'ice', amount: 120 },
      { ingredientId: 'sugar', amount: 15 },
    ],
  },
  {
    id: 3,
    name: '椰香芒果冰',
    description: '热带风情的芒果特调',
    recipe: [
      { ingredientId: 'coconut', amount: 150 },
      { ingredientId: 'mango', amount: 80 },
      { ingredientId: 'ice', amount: 100 },
      { ingredientId: 'cream', amount: 30 },
    ],
  },
  {
    id: 4,
    name: '草莓生椰乳',
    description: '少女心满满的草莓特调',
    recipe: [
      { ingredientId: 'coconut', amount: 180 },
      { ingredientId: 'strawberry', amount: 60 },
      { ingredientId: 'ice', amount: 90 },
      { ingredientId: 'sugar', amount: 10 },
      { ingredientId: 'cream', amount: 20 },
    ],
  },
  {
    id: 5,
    name: '鸳鸯奶茶',
    description: '咖啡与奶茶的完美融合',
    recipe: [
      { ingredientId: 'tea', amount: 100 },
      { ingredientId: 'coffee', amount: 80 },
      { ingredientId: 'milk', amount: 120 },
      { ingredientId: 'ice', amount: 70 },
      { ingredientId: 'sugar', amount: 25 },
    ],
  },
];

export function getIngredientById(id: string): Ingredient | undefined {
  return INGREDIENTS.find((ing) => ing.id === id);
}

export function getLevelById(id: number): Level | undefined {
  return LEVELS.find((level) => level.id === id);
}
