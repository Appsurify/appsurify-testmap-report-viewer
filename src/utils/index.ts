
export const truncateArgs = (args: string[], maxLength: number): string => {
  const joined = args.join(', ');
  return joined.length > maxLength
    ? joined.slice(0, maxLength - 1) + '…'
    : joined;
};
