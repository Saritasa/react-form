// @flow
function createEmptyObject(): {||} {
  return ({}: any);
}

export function prepareErrors(
  errors: null | { [key: string]: ?string },
): {| [key: string]: string |} {
  if (typeof errors !== 'object') return createEmptyObject();
  if (!errors) return createEmptyObject();

  const entries: Array<[string, string]> = (Object.entries(errors).filter(
    ([key, value]) => typeof value === 'string' && value.length > 0,
  ): any);

  return entries.reduce(
    (accum, [key, value]) => ({ ...accum, [key]: value }),
    createEmptyObject(),
  );
}
