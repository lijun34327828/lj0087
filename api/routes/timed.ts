import { Router, type Request, type Response } from 'express';
import { getAllTimedRecords, getTimedRecord, submitTimedRecord } from '../data/timedRecords.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const records = getAllTimedRecords();
  res.status(200).json({
    success: true,
    records,
  });
});

router.get('/:levelId', (req: Request, res: Response) => {
  const levelId = parseInt(req.params.levelId, 10);
  const record = getTimedRecord(levelId);

  if (!record) {
    res.status(404).json({
      success: false,
      error: '关卡不存在',
    });
    return;
  }

  res.status(200).json({
    success: true,
    record,
  });
});

router.post('/submit', (req: Request, res: Response) => {
  const { levelId, time } = req.body;

  if (levelId === undefined || time === undefined) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数 levelId 或 time',
    });
    return;
  }

  const record = submitTimedRecord(levelId, time);

  if (!record) {
    res.status(404).json({
      success: false,
      error: '关卡不存在',
    });
    return;
  }

  res.status(200).json({
    success: true,
    record,
  });
});

export default router;
