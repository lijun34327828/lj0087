import { Router, type Request, type Response } from 'express';
import { INGREDIENTS, LEVELS, getLevelById } from '../data/ingredients.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    levels: LEVELS,
    ingredients: INGREDIENTS,
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const level = getLevelById(id);

  if (!level) {
    res.status(404).json({
      success: false,
      error: '关卡不存在',
    });
    return;
  }

  res.status(200).json({
    success: true,
    level,
    ingredients: INGREDIENTS,
  });
});

export default router;
