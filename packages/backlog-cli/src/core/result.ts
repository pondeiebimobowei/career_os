export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E; code?: string };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function fail<E = Error>(error: E, code?: string): Result<never, E> {
  return { success: false, error, code };
}
