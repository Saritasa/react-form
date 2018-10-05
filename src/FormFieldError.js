// @flow
import * as React from 'react';
import { Field } from 'formik';

import { FormError } from './FormError';

export type FormFieldErrorProps = {
  name: ?string,
  component: $PropertyType<React.ElementProps<typeof FormError>, 'component'>,
};

/**
 * Component to display error message for 1 field.
 *
 * @param {string} name - Field's name to display error.
 * @param {React.Component} component - Component to render field's error.
 * @returns {?React.Node} `null` if field is not touched or there is not error.
 *   Or it returns rendered `component` with field's error as #error property.
 */
export const FormFieldError = ({ name, component }: FormFieldErrorProps) => (
  <Field
    name={name}
    render={({ form: { errors, touched } }) => {
      if (!touched) return null;
      if (!errors) return null;
      if (!touched[name]) return null;
      if (!errors[name]) return null;

      return <FormError component={component} error={errors[name]} />;
    }}
  />
);
