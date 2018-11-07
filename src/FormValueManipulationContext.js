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

type FormValueManipulationContextValue = {
  setFieldValue: (string, any) => void,
  onChange: (event: any) => void,
};

const defaultValue = {
  setFieldValue: ensureContextIsNotEmpty,
  onChange: ensureContextIsNotEmpty,
};

export const FormValueManipulationContext = React.createContext<FormValueManipulationContextValue>(
  defaultValue,
);
