// @flow
import * as React from 'react';

/* eslint-disable no-unused-vars */
/**
 * Function to ensure if context is not empty for values' manipulating.
 *
 * @param {Array} rest - Does not meter.
 */
function ensureContextIsNotEmpty(...rest: any) {
  /* eslint-enable no-unused-vars */
  throw new Error(
    "You can't use FormValueManipulationContext outside Form. Please check your application's code.",
  );
}

export const FormValueManipulationContext = React.createContext({
  setFieldValue: ensureContextIsNotEmpty,
  onChange: ensureContextIsNotEmpty,
});
