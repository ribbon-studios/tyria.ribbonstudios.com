export function parseSafe<T>(json?: string | null): T | undefined;
export function parseSafe<T>(json: string | null | undefined, defaultValue: T): T;
export function parseSafe<T>(json?: string | null, defaultValue?: T): T | undefined {
  if (!json) return defaultValue ?? undefined;

  try {
    return JSON.parse(json);
  } catch {
    return defaultValue ?? undefined;
  }
}
