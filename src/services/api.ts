import type {
  Ingredient,
  Level,
  PlayerSubmission,
  ValidationResult,
  TimedModeRecord,
} from '../../shared/types';

const API_BASE = '/api';

export async function fetchLevels(): Promise<{ levels: Level[]; ingredients: Ingredient[] }> {
  const response = await fetch(`${API_BASE}/levels`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '获取关卡数据失败');
  }
  return { levels: data.levels, ingredients: data.ingredients };
}

export async function fetchLevelById(
  id: number,
): Promise<{ level: Level; ingredients: Ingredient[] }> {
  const response = await fetch(`${API_BASE}/levels/${id}`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '获取关卡数据失败');
  }
  return { level: data.level, ingredients: data.ingredients };
}

export async function validateSubmission(
  submission: PlayerSubmission,
): Promise<ValidationResult> {
  const response = await fetch(`${API_BASE}/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submission),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '校验失败');
  }
  return data.data;
}

export async function fetchTimedRecords(): Promise<TimedModeRecord[]> {
  const response = await fetch(`${API_BASE}/timed`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '获取限时记录失败');
  }
  return data.records;
}

export async function submitTimedRecord(
  levelId: number,
  time: number,
): Promise<TimedModeRecord> {
  const response = await fetch(`${API_BASE}/timed/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ levelId, time }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '提交限时记录失败');
  }
  return data.record;
}
