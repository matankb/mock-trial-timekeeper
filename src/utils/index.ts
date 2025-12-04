import { Side } from '../types/side';

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

export function getPiSideName(date: Date) {
  // 2023-2024 season P = Prosecution, 2024-2025 season P = Plaintiff, etc.
  const year = date.getFullYear();
  const yearFromStart = year - 2023;
  const isEven = yearFromStart % 2 === 0;
  const isFirstHalfOfSeason = date.getMonth() >= 5; // Season starts in August
  if ((isEven && isFirstHalfOfSeason) || (!isEven && !isFirstHalfOfSeason)) {
    return 'Prosecution';
  }
  return 'Plaintiff';
}

// TODO: technically... old trials should have the side name from when they were created
// presumably, this will stay the same for the entire session
export const piSideName = getPiSideName(new Date());

export function getSideName(side: Side) {
  if (side === 'p') {
    return piSideName;
  } else if (side === 'd') {
    return 'Defense';
  }
  return 'Unknown Side';
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
