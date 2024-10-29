export const generateRandID = (): string => {
  return (
    'id-' +
    Math.random().toString(36).slice(2, 11) +
    '-' +
    Date.now().toString(36)
  );
};

export const generateRandDebounceTime = (min: number, max: number): number => {
  if (min > max) {
    return 500;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
