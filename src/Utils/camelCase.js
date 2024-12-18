// utils/camelCase.js
export const toCamelCase = (str) =>
  str.replace(/([-_][a-z])/gi, (match) =>
    match.toUpperCase().replace("-", "").replace("_", "")
  );

export const keysToCamel = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map((v) => keysToCamel(v));

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = toCamelCase(key);
    acc[camelKey] = keysToCamel(obj[key]);
    return acc;
  }, {});
};
