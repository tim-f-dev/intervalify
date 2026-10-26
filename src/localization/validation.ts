export function flattenTranslations(value: unknown, prefix = '', result: Record<string, string> = {}) {
  if (typeof value === 'string') result[prefix] = value;
  else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) flattenTranslations(child, prefix ? `${prefix}.${key}` : key, result);
  }
  return result;
}
function variables(value: string) {
  return [...value.matchAll(/{{\s*([\w.]+)(?:\s*,[^}]*)?\s*}}/g)].map((match) => match[1]).sort();
}
export function validateTranslationPair(reference: unknown, translated: unknown): string[] {
  const source = flattenTranslations(reference), target = flattenTranslations(translated);
  const errors: string[] = [];
  for (const key of Object.keys(source)) {
    if (!target[key]?.trim()) errors.push(`Missing or empty key: ${key}`);
    else if (JSON.stringify(variables(source[key])) !== JSON.stringify(variables(target[key]))) errors.push(`Interpolation mismatch: ${key}`);
  }
  for (const key of Object.keys(target)) if (!(key in source)) errors.push(`Unexpected key: ${key}`);
  return errors;
}
