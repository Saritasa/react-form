// @flow
import * as React from 'react';
import { Formik } from 'formik';
import type { FormikErrors, FormikActions, FormikConfig } from './FormikTypes';

import { createFormInternalComponent } from './createFormInternalComponent';
import { prepareErrors } from './prepareErrors';

type FormikInstance = Formik<> & FormikActions<$PropertyType<*, 'values'>>;

export type FormProps<Values: Object> = {
  ...$Exact<FormikConfig<Values>>,
  errors?: FormikErrors<Values>,
  submitting?: boolean,
  onSubmit: (Values, FormikActions<Values>) => void | (Values => void),
  component:
    | Class<React.Component<any>>
    | React.StatelessFunctionalComponent<any>,
  fieldRules: (Values, string) => Values,
  allowChangesWhileSubmitting?: boolean,
};

/**
 * Form class that allows to work with.
 */
export class Form<Values: Object> extends React.PureComponent<
  FormProps<Values>,
> {
  Component: (*) => React.Node;
  formik: ?FormikInstance;

  static defaultProps = {
    allowChangesWhileSubmitting: false,
    component: () => `Use #component property for form's layout.`,
  };

  /**
   * Creates Form instance.
   *
   * @param {FormProps} props Form's props.
   */
  constructor(props: *) {
    super(props);

    const Component: $Call<
      typeof createFormInternalComponent,
      | Class<React.Component<*>>
      | Class<React.Component<*, *>>
      | ((*) => React.Node),
    > = createFormInternalComponent(props.component);

    this.Component = formikProps => (
      <Component {...this.props} {...formikProps} />
    );
  }

  /**
   * Updates errors and submitting states.
   *
   * @param {*} nextProps Next component's props.
   */
  componentWillReceiveProps(nextProps: any) {
    this.updateErrorsIfNeed(nextProps);
    this.updateSubmittingIfNeed(nextProps);
  }

  /**
   * Saves reference to the formik's instance.
   *
   * @param {Formik|null} formik Formik's instance or null if removing.
   */
  handleRef = (formik: ?FormikInstance) => {
    this.formik = formik;
  };

  /**
   * Handle submit event.
   *
   * @param {Values} data Form's values.
   * @param {Array<*>} rest Rest arguments.
   */
  handleSubmit = (data: *, ...rest: *) => {
    this.props.onSubmit(data, ...rest);
  };

  /**
   * Sync errors from props and state.
   *
   * @param {*} props Component's props.
   */
  updateErrorsIfNeed(props: any) {
    if (this.props.errors !== props.errors) {
      if (this.formik) {
        this.formik.setErrors(prepareErrors(props.errors));
      }
    }
  }

  /**
   * Sync submitting flag from props and state.
   *
   * @param {*} props Component's props.
   */
  updateSubmittingIfNeed(props: any) {
    if (this.props.submitting !== props.submitting) {
      if (this.formik) {
        this.formik.setSubmitting(props.submitting);
      }
    }
  }

  /**
   * Validates form and return errors object.
   *
   * @param {Values} values Form's values.
   * @returns {null|Object} Null or object with errors.
   */
  validate = (values: $Shape<Values>) => {
    const { validate } = this.props;

    if (!validate) return null;

    return prepareErrors(validate(values));
  };

  /**
   * Renders Formik with internal component.
   *
   * @returns {React.Element} Rendered form.
   */
  render() {
    const {
      initialValues,
      validate,
      errors,
      component,
      render,
      children,
      ...rest
    } = this.props;
    const { Component } = this;

    return (
      <Formik
        {...rest}
        ref={this.handleRef}
        component={Component}
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        validate={this.validate}
      />
    );
  }
}
