// @flow
import * as React from 'react';
import type { FormikProps } from './FormikTypes';
import { setIn } from './utils';
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

    /**
     * Default react hook. Save values to the component.
     */
    componentWillMount() {
      this.performChangeValues(this.props);
    }

    /**
     * Check if values were changed and save it.
     *
     * @param {FromInternalComponentProps<Values>} nextProps Next props.
     */
    componentWillReceiveProps(nextProps: *) {
      if (nextProps.values !== this.values) {
        this.performChangeValues(nextProps);
      }
    }

    /**
     * Handle onChange event on native controls.
     *
     * @param {SyntheticInputEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} event Change event.
     */
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

    /**
     * Sets field value.
     *
     * @param {string} field Field to change.
     * @param {*} value Next value.
     */
    setFieldValue = (field: string, value: *) => {
      if (this.shouldPreventChanges()) return;

      const { fieldRules } = this.props;
      const { values } = this;

      const nextValues = fieldRules(setIn(values, field, value), field);
      this.setValues(nextValues);
    };

    /**
     * Sets updated values.
     * @param {Values} values values to set.
     */
    setValues = (values: Values) => {
      const { setValues } = this.props;

      this.values = values;
      setValues(this.values);
    };

    /**
     * Checks if any change should be preventing.
     *
     * @returns {boolean} True if changes should be prevented.
     */
    shouldPreventChanges() {
      return this.props.isSubmitting && !this.props.allowChangesWhileSubmitting;
    }

    /**
     * Applies fieldRules and sets values for the form.
     *
     * @param {FromInternalComponentProps<Values>} props Component's props.
     */
    performChangeValues(props: FromInternalComponentProps<Values>) {
      const { values, fieldRules } = props;

      this.setValues(this.values);
    }

    /**
     * Gets component props.
     *
     * @returns {Object} Props for component.
     */
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

      const disabledSubmit = disabledFromParent || isSubmitting || !isValid;

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

    /**
     * Renders FormValueContext.Provider with Component.
     *
     * @returns {React.Element} Rendered form.
     */
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
