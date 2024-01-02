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

function getPiSideName() {
  // 2023-2024 season P = Prosecution, 2024-2025 season P = Plaintiff, etc.
  const year = new Date().getFullYear();
  const yearFromStart = year - 2023;
  const isEven = yearFromStart % 2 === 0;
  const isFirstHalfOfSeason = new Date().getMonth() >= 5; // Season starts in August
  if ((isEven && isFirstHalfOfSeason) || (!isEven && !isFirstHalfOfSeason)) {
    return 'Prosecution';
  }
  return 'Plaintiff';
}

// presumably, this will stay the same for the entire session
export const piSideName = getPiSideName();
