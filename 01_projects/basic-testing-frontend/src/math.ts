export const add = (...args: number[]) => {
  return args.reduce((acc, current) => acc + current, 0);
};
