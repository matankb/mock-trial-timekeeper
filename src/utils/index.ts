import { Side } from '../types/side';
import { League } from '../types/league';

export const pad = (s: number) => s.toString().padStart(2, '0');

// Format time as mm:ss
export function formatTime(seconds: number) {
  const absoluteSeconds = Math.abs(seconds);

  const minutes = Math.floor((absoluteSeconds % 3600) / 60);
  const isNegative = seconds < 0;

  return `${isNegative ? '-' : ''}${pad(minutes)}:${pad(absoluteSeconds % 60)}`;
}

// Format  time as as "__h __m"
export function formatTimeWords(seconds: number) {
  const absoluteSeconds = Math.abs(seconds);

  const hours = Math.floor(absoluteSeconds / 3600);
  const minutes = Math.floor((absoluteSeconds % 3600) / 60);

  if (hours === 0 && minutes < 5) {
    const secondsRemaining = absoluteSeconds % 60;
    return `0h ${minutes}m ${secondsRemaining}s`;
  }

  return `${hours}h ${minutes}m`;
}

export const duration = {
  minutes: (n: number) => n * 60,
  hours: (n: number) => n * 60 * 60,
};

export function isValidJson(data: string) {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
}

export type KeysWithTrue<
  Obj extends Record<PropertyKey, Record<PropertyKey, boolean>>,
  Flag extends PropertyKey,
> = {
  [K in keyof Obj]: Obj[K][Flag] extends true ? K : never;
}[keyof Obj];
