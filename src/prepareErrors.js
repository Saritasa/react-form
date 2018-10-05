// @flow
/**
 * Function creates empty exact object that is valid for flow.
 *
 * @returns {$Exact<{}>} Empty object.
 */
function createEmptyObject(): {||} {
  return ({}: any);
}

/**
 * Removes empty errors from object and prevent errors = null.
 *
 * @param {null|Object<string, string|null>} errors Raw errors object.
 * @returns {Object<string, string>} Pretty errors object with omitted fields without errors.
 */
export function prepareErrors(
  errors: null | { [key: string]: ?string },
): {| [key: string]: string |} {
  if (typeof errors !== 'object') return createEmptyObject();
  if (!errors) return createEmptyObject();

  const entries: Array<[string, string]> = (Object.entries(errors).filter(
    // eslint-disable-next-line no-unused-vars
    ([key, value]) => typeof value === 'string' && value.length > 0,
  ): any);

  return entries.reduce(
    (accum, [key, value]) => ({ ...accum, [key]: value }),
    createEmptyObject(),
  );
}
