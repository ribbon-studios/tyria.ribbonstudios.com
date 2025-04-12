export function json<T = any>(json?: string | null): T | undefined;
export function json<T = any>(json: string | null | undefined, defaultValue: T): T;
export function json<T = any>(json?: string | null, defaultValue?: T): T | undefined {
  if (!json) return defaultValue ?? undefined;

  try {
    return JSON.parse(json);
  } catch {
    return defaultValue ?? undefined;
  }
}
