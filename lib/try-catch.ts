/**
 * Runs an async operation and returns a result object instead of throwing.
 *
 * @param operation - Async function to execute
 * @returns Data on success, or a normalized Error on failure
 */
export async function tryCatch<T>(
  operation: () => Promise<T>
): Promise<
  | { readonly data: T; readonly error: null }
  | { readonly data: null; readonly error: Error }
> {
  try {
    return { data: await operation(), error: null }
  } catch (caught: unknown) {
    const error = caught instanceof Error ? caught : new Error(String(caught))
    return { data: null, error }
  }
}
