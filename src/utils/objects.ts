/**
 * Updates the properties of an object with the properties from another object.
 *
 * @param dst - The destination object to be updated.
 * @param data - The object containing the properties to update.
 * @returns The updated object.
 */

export const updateObject = <T extends object>(
  dst: T,
  data: Record<string, unknown>
) => {
  Object.entries(data).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(dst, key)) {
      (dst as Record<string, unknown>)[key] = value;
    }
  });
  return dst;
};
