import type {
  PlayerSubmission,
  ValidationResult,
  ValidationError,
  ComparisonItem,
} from '../../shared/types.js';
import { getLevelById, getIngredientById } from '../data/ingredients.js';

export function validateSubmission(submission: PlayerSubmission): ValidationResult {
  const level = getLevelById(submission.levelId);
  const errors: ValidationError[] = [];
  const comparison: ComparisonItem[] = [];

  if (!level) {
    return {
      success: false,
      errors: [
        {
          type: 'missing',
          message: `关卡 ${submission.levelId} 不存在`,
        },
      ],
      comparison: [],
    };
  }

  const standardRecipeMap = new Map(level.recipe.map((r) => [r.ingredientId, r.amount]));
  const playerItemsMap = new Map(submission.items.map((i) => [i.ingredientId, i.amount]));
  const allIngredientIds = new Set([
    ...standardRecipeMap.keys(),
    ...playerItemsMap.keys(),
  ]);

  for (const ingredientId of allIngredientIds) {
    const ingredient = getIngredientById(ingredientId);
    const ingredientName = ingredient?.name || ingredientId;
    const expected = standardRecipeMap.get(ingredientId) ?? null;
    const actual = playerItemsMap.get(ingredientId) ?? null;

    if (expected !== null && actual === null) {
      errors.push({
        type: 'missing',
        ingredientId,
        ingredientName,
        expected,
        message: `缺少原料：${ingredientName} (${expected}克)`,
      });
      comparison.push({
        ingredientId,
        ingredientName,
        expected,
        actual,
        status: 'missing',
      });
    } else if (expected === null && actual !== null) {
      errors.push({
        type: 'extra',
        ingredientId,
        ingredientName,
        actual,
        message: `多余原料：${ingredientName} (${actual}克)`,
      });
      comparison.push({
        ingredientId,
        ingredientName,
        expected,
        actual,
        status: 'extra',
        diff: actual,
      });
    } else if (expected !== null && actual !== null) {
      if (expected === actual) {
        comparison.push({
          ingredientId,
          ingredientName,
          expected,
          actual,
          status: 'correct',
        });
      } else {
        const diff = actual - expected;
        errors.push({
          type: 'amount_mismatch',
          ingredientId,
          ingredientName,
          expected,
          actual,
          message: `${ingredientName} 分量偏差：标准 ${expected}克，当前 ${actual}克 (${diff > 0 ? '多' : '少'}${Math.abs(diff)}克)`,
        });
        comparison.push({
          ingredientId,
          ingredientName,
          expected,
          actual,
          status: 'incorrect',
          diff,
        });
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
    comparison,
  };
}
