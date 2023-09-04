export const pad = (s: number) => s.toString().padStart(2, '0');

// todo: just clean this function up
export function formatTime(seconds: number, highlightNegative?: boolean) {
  const absoluteSeconds = Math.abs(seconds);

  const hours = Math.floor(absoluteSeconds / 3600);
  const minutes = Math.floor((absoluteSeconds % 3600) / 60);
  const isNegative = seconds < 0;

  return `${isNegative ? '-' : ''}${pad(minutes)}:${pad(absoluteSeconds % 60)}`;
}

// format with __h __m
export function formatTimeWords(seconds: number) {
  const absoluteSeconds = Math.abs(seconds);

  const hours = Math.floor(absoluteSeconds / 3600);
  const minutes = Math.floor((absoluteSeconds % 3600) / 60);
  const isNegative = seconds < 0;

  if (hours === 0 && minutes < 5) {
    const secondsRemaining = absoluteSeconds % 60;
    return `${isNegative ? '-' : ''}${hours}h ${minutes}m ${secondsRemaining}s`;
  }

  return `${isNegative ? '-' : ''}${hours}h ${minutes}m`;
}

export function highlight(doHighlight: boolean) {
  return { className: doHighlight ? 'highlight' : '' };
}

// TODO: default for rename dialog
