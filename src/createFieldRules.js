// @flow
type FieldRule<T> = (T, string) => T;
type FieldRules<T> = FieldRule<T> | Array<FieldRule<T>>;

/**
 * Function that merge many field rules into 1 function.
 *
 * @param {Array<FieldRule>|FieldRule} rule Function that takes values and return new object with values or old.
 * @param {Array<FieldRule>} otherRules Array of other `rule`'s functions.
 * @returns {FieldRule} Function that runs every passed field rule and returns theirs result.
 */
export function createFieldRules<T>(
  rule: FieldRule<T>,
  ...otherRules: Array<FieldRule<T>>
): FieldRule<T> {
  const rules: FieldRules<T> = Array.isArray(rule)
    ? [...rule, ...otherRules]
    : [rule, ...otherRules];

  /**
   * Function call 1 rule.
   *
   * @private
   * @param {Object} currentValues Current values' object.
   * @param {FieldRule} currentRule Current rule to run.
   * @param {string} changedField Changed field's name.
   * @returns {Object} Old values' object or new object.
   */
  function reduce(
    currentValues: T,
    currentRule: FieldRule<T>,
    changedField: string,
  ): T {
    return currentRule(currentValues, changedField);
  }

  return (values: T, changedField: string) =>
    rules.reduce(
      (currentValues, currentRule) =>
        reduce(currentValues, currentRule, changedField),
      values,
    );
}
