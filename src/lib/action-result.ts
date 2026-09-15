export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export function actionError(error: unknown, fallback = "Não foi possível concluir. Tente novamente."): ActionResult<never> {
  if (process.env.NODE_ENV === "development") console.error(error);
  return { success: false, error: fallback };
}
