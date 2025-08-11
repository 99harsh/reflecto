export function formatNumberToShortForm(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '0';

  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (absValue >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (absValue >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  return value.toString();
}