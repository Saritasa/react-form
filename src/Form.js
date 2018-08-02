// @flow
import * as React from 'react';
import { Formik } from 'formik';
import type {
  FormikErrors,
  FormikActions,
  FormikConfig,
} from './FormikTypes';

import { createFormInternalComponent } from './createFormInternalComponent';

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
  static defaultProps = {
    allowChangesWhileSubmitting: false,
    component: () => `Use #component property for form's layout.`,
  };

  Component: (*) => React.Node;
  formik: ?FormikInstance;

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

  componentWillReceiveProps(nextProps: any) {
    this.updateErrorsIfNeed(nextProps);
    this.updateSubmittingIfNeed(nextProps);
  }

  updateErrorsIfNeed(props: any) {
    if (this.props.errors !== props.errors) {
      if (this.formik) {
        this.formik.setErrors(props.errors);
      }
    }
  }

  updateSubmittingIfNeed(props: any) {
    if (this.props.submitting !== props.submitting) {
      if (this.formik) {
        this.formik.setSubmitting(props.submitting);
      }
    }
  }

  handleRef = (formik: ?FormikInstance) => {
    this.formik = formik;
  };

  handleSubmit = (data: *, ...rest: *) => {
    this.props.onSubmit(data, ...rest);
  };

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
        errors={errors}
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        validate={validate}
      />
    );
  }
}
