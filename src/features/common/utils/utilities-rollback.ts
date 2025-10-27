/**
 * Obtenemos los datos que fueron modificados
 * @param original
 * @param updated
 * @returns
 */
export const getModifiedFields = <T extends object>(
  original: T,
  updated: Partial<T>
): Partial<T> => {
  const modified = {} as Partial<T>;

  (Object.keys(updated) as (keyof T)[]).forEach((key) => {
    if (updated[key] !== undefined && updated[key] !== original[key]) {
      modified[key] = updated[key];
    }
  });

  return modified;
};

export const getPreviousValues = <T extends object>(
  original: T,
  updated: Partial<T>
): Partial<T> => {
  const previous = {} as Partial<T>;

  (Object.keys(updated) as (keyof T)[]).forEach((key) => {
    // Guardamos el valor ORIGINAL (viejo)
    previous[key] = original[key];
  });

  return previous;
};

export const deepCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const generateTempId = () =>
  `temp-${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;
