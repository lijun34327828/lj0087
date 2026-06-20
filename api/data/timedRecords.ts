import type { TimedModeRecord } from '../../shared/types.js';
import { LEVELS } from './ingredients.js';

const timedRecords: Map<number, number> = new Map();

export function getAllTimedRecords(): TimedModeRecord[] {
  return LEVELS.map((level) => ({
    levelId: level.id,
    bestTime: timedRecords.get(level.id) ?? null,
  }));
}

export function getTimedRecord(levelId: number): TimedModeRecord | null {
  const level = LEVELS.find((l) => l.id === levelId);
  if (!level) return null;
  return {
    levelId,
    bestTime: timedRecords.get(levelId) ?? null,
  };
}

export function submitTimedRecord(levelId: number, time: number): TimedModeRecord | null {
  const level = LEVELS.find((l) => l.id === levelId);
  if (!level) return null;

  const currentBest = timedRecords.get(levelId);
  if (currentBest === undefined || time < currentBest) {
    timedRecords.set(levelId, time);
  }

  return {
    levelId,
    bestTime: timedRecords.get(levelId)!,
  };
}
