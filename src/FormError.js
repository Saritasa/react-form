// @flow
import * as React from 'react';

type FormErrorComponentProps = {
  children: string,
};

export type FormErrorProps = {
  error: ?string,
  component:
    | string
    | Class<React.Component<FormErrorComponentProps, any>>
    | Class<React.Component<FormErrorComponentProps>>
    | React.StatelessFunctionalComponent<FormErrorComponentProps>,
};

/**
 * Component to display error message for form or 1 form's field.
 *
 * @param {?string} error - Error message to display.
 * @param {React.Component} component - Component to render error.
 * @returns {?React.Node} `null` if field is not touched or there is not error.
 *   Or it returns rendered `component` with field's error as #error property.
 */
export const FormError = ({ error, component: Component }: FormErrorProps) => {
  if (error) return <Component>{error}</Component>;

  return null;
};

FormError.defaultProps = {
  component: 'div',
};
