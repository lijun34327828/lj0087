import { Router, type Request, type Response } from 'express';
import { validateSubmission } from '../services/validationService.js';
import type { PlayerSubmission } from '../../shared/types.js';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const submission = req.body as PlayerSubmission;

  if (!submission.levelId || !Array.isArray(submission.items)) {
    res.status(400).json({
      success: false,
      error: '请求参数不完整',
    });
    return;
  }

  const result = validateSubmission(submission);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export default router;
