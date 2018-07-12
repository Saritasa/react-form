// @flow
import * as React from 'react';
import { type FormikProps } from './FormikTypes';

import { FormValueManipulationContext } from './FormValueManipulationContext';

export type FromInternalComponentProps<Values: Object> = FormikProps<Values> & {
  allowChangesWhileSubmitting?: false,
  fieldRules: (Values, ?string) => Values,
  disabledSubmit?: boolean,
  valid: boolean,
  submitting: boolean,
  onChange: (SyntheticInputEvent<*>) => any,
  onBlur: (SyntheticFocusEvent<*>) => any,
  onSubmit: (SyntheticEvent<*>) => any,
  onReset: (SyntheticEvent<*>) => any,
};

/**
 * Creates internal Form component to handle changes and improve default Formik's behavior.
 *
 * @private
 * @param {React.Component} Component View part of form.
 * @returns {FormInternal} New component that wraps passed.
 */
export function createFormInternalComponent<Values: Object>(Component: *) {
  /**
   * Generated component to improve default Formik's behavior.
   *
   * @extends React.Component
   */
  class FormInternal extends React.PureComponent<
    FromInternalComponentProps<Values>,
  > {
    values: Values;

    static defaultProps = {
      isSubmitting: false,
      disabledSubmit: false,
      isValid: true,
      allowChangesWhileSubmitting: false,
      fieldRules: <V>(values: V): V => values,
    };

    componentWillMount() {
      this.performChangeValues(this.props);
    }

    componentWillReceiveProps(nextProps: *) {
      if (nextProps.values !== this.values) {
        this.performChangeValues(nextProps);
      }
    }

    handleChange = (
      event: SyntheticInputEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
      >,
    ) => {
      if (this.shouldPreventChanges()) {
        event.preventDefault();
      } else {
        const { name, value } = event.target;

        this.setFieldValue(name, value);
      }
    };

    shouldPreventChanges() {
      return this.props.isSubmitting && !this.props.allowChangesWhileSubmitting;
    }

    setFieldValue = (field: string, value: *) => {
      if (this.shouldPreventChanges()) return;

      const { setValues, fieldRules } = this.props;
      const { values } = this;

      this.values = fieldRules({ ...values, [field]: value }, field);
      setValues(this.values);
    };

    performChangeValues(props: FromInternalComponentProps<Values>) {
      const { setValues, values, fieldRules } = props;

      this.values = fieldRules(values);
      setValues(this.values);
    }

    getComponentProps(): * {
      const {
        handleSubmit,
        handleChange,
        handleReset,
        handleBlur,
        disabledSubmit: disabledFromParent,
        isSubmitting,
        isValid,
        ...rest
      } = this.props;

      const disabledSubmit = disabledFromParent || isSubmitting;

      return {
        ...rest,
        setFieldValue: this.setFieldValue,
        disabledSubmit,
        submitting: isSubmitting,
        valid: isValid,
        onChange: this.handleChange,
        onBlur: handleBlur,
        onSubmit: handleSubmit,
        onReset: handleReset,
      };
    }

    render() {
      const props = this.getComponentProps();

      return React.createElement(
        FormValueManipulationContext.Provider,
        {
          value: {
            setFieldValue: this.setFieldValue,
            onChange: this.handleChange,
          },
        },
        React.createElement(Component, props),
      );
    }
  }

  return FormInternal;
}
