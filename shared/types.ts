export interface Ingredient {
  id: string;
  name: string;
  icon: string;
  unit: string;
  color: string;
}

export interface RecipeItem {
  ingredientId: string;
  amount: number;
  tolerance?: number;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  recipe: RecipeItem[];
}

export interface PlayerSubmission {
  levelId: number;
  items: { ingredientId: string; amount: number }[];
}

export interface ValidationError {
  type: 'missing' | 'extra' | 'amount_mismatch';
  ingredientId?: string;
  ingredientName?: string;
  expected?: number;
  actual?: number;
  message: string;
}

export interface ComparisonItem {
  ingredientId: string;
  ingredientName: string;
  expected: number | null;
  actual: number | null;
  status: 'correct' | 'missing' | 'extra' | 'incorrect';
  diff?: number;
}

export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  comparison: ComparisonItem[];
}
