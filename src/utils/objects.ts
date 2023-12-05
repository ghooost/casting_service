export const updateObject = <T extends object>(
  dst: T,
  data: Record<string, unknown>
) => {
  Object.entries(data).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(dst, key)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dst as any)[key] = value;
    }
  });
  return dst;
};
