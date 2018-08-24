// @flow
import * as React from 'react';
import { Field } from 'formik';

import { FormValueManipulationContext } from './FormValueManipulationContext';

export type PropsFromFormikField<ValueType> = {
  field: {
    name: string,
    value: ValueType,
    onChange: (SyntheticInputEvent<HTMLElement>) => void,
    onBlur: (SyntheticFocusEvent<HTMLElement>) => void,
  },
  form: {
    touched: { [string]: boolean },
    errors: { [string]: ?string },
    setFieldValue: <T>(string, T) => void,
  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
};

export type FormFieldComponentProps<ValueType> = {
  name: string,
  value: ValueType,
  error: ?string,
  setFieldValue: (string, ValueType) => void,
  onChange: (SyntheticInputEvent<HTMLElement>) => void,
  onBlur: (SyntheticFocusEvent<HTMLElement>) => void,
};

export type FormFieldProps<ValueType> = {
  name: string,
  render?: empty,
  children?: empty,
  component:
    | string
    | Class<React.Component<FormFieldComponentProps<ValueType>>>
    | Class<React.Component<FormFieldComponentProps<ValueType>, any>>
    | React.StatelessFunctionalComponent<FormFieldComponentProps<ValueType>>,
};

/**
 * Class to display any form's field inside Form tag.
 *
 * Passes error, value and callbacks into component.
 *
 * @returns {FormField} Instance of FormField.
 */
export class FormField<ValueType> extends React.PureComponent<
  FormFieldProps<ValueType>,
> {
  static defaultProps = { component: 'input' };

  /**
   * Method to get error from form's errors object by field name.
   *
   * @param {Object} field - Form's field descriptor.
   * @param {Object} field.name - Field's name.
   * @param {Object} form - Form's state.
   * @param {Object} form.touched - Flags for every form's field if someone changed it.
   * @param {Object} form.errors - Object with form's errors.
   * @returns {?string} Error message or null.
   */
  static getError({ field, form }: PropsFromFormikField<any>) {
    const { touched, errors } = form;
    const { name } = field;

    if (!errors) return null;
    if (!touched[name]) return null;

    return errors[name];
  }

  /**
   * Method to render field's control.
   *
   * @param {Object} field - Form's field descriptor.
   * @param {Object} field.name - Field's name.
   * @param {Object} form - Form's state.
   * @param {Object} form.touched - Flags for every form's field if someone changed it.
   * @param {Object} form.errors - Object with form's errors.
   * @param {Object} props - All other props from Field's usage.
   * @returns {React.Node} Rendered component with form's control.
   */
  renderField = ({
    field,
    form,
    ...props
  }: PropsFromFormikField<ValueType>) => {
    const { component: Component } = this.props;

    return (
      <FormValueManipulationContext.Consumer>
        {({ setFieldValue, onChange }) => (
          <Component
            {...field}
            {...props}
            error={FormField.getError({ field, form })}
            onChange={onChange}
            setFieldValue={setFieldValue}
          />
        )}
      </FormValueManipulationContext.Consumer>
    );
  };

  /**
   * Renders component with adding extra props into it.
   *
   * @returns {React.Node} Form's field with extra props.
   */
  render() {
    const { component, render, children, ...rest } = this.props;

    return <Field {...rest} render={this.renderField} />;
  }
}
