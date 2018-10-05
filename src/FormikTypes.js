// @flow
// flow-typed signature: 5611f21d2cf7f4049f5e7ac100db47ba
// flow-typed version: 21f5aed438/formik_v0.11.x/flow_>=v0.53.x
/* eslint-disable import/no-mutable-exports, no-var, vars-on-top, no-undef, require-jsdoc */
export type FormikErrors<Values: Object> = {
  [field: $Keys<Values>]: string,
};

export type FormikTouched<Values: Object> = {
  [field: $Keys<Values>]: boolean,
};

/**
 * Formik state tree
 */
export type FormikState<Values: Object> = {
  /** Form values */
  values: Values,
  /**
   * Top level error, in case you need it
   * @deprecated since 0.8.0
   */
  error?: any,
  /** map of field names to specific error for that field */
  errors: FormikErrors<Values>,
  /** map of field names to whether the field has been touched */
  touched: FormikTouched<Values>,
  /** whether the form is currently submitting */
  isSubmitting: boolean,
  /** Top level status state, in case you need it */
  status?: any,
  /** Number of times user tried to submit the form */
  submitCount: number,
};

/**
 * Using interface here because interfaces support overloaded method signatures
 * https://github.com/facebook/flow/issues/1556#issuecomment-200051475
 */
export interface FormikActions<Values: Object> {
  /** Manually set top level status. */
  setStatus(status?: any): void;
  /**
   * Manually set top level error
   * @deprecated since 0.8.0
   */
  setError(e: any): void;
  /** Manually set errors object */
  setErrors(errors: FormikErrors<Values>): void;
  /** Manually set isSubmitting */
  setSubmitting(isSubmitting: boolean): void;
  /** Manually set touched object */
  setTouched(touched: FormikTouched<Values>): void;
  /** Manually set values object  */
  setValues(values: Values): void;
  /** Set value of form field directly */
  setFieldValue(
    field: $Keys<Values>,
    value: any,
    shouldValidate?: boolean,
  ): void;
  setFieldValue(field: string, value: any, shouldValidate?: boolean): void;
  /** Set error message of a form field directly */
  setFieldError(field: $Keys<Values>, message: string): void;
  setFieldError(field: string, message: string): void;
  /** Set whether field has been touched directly */
  setFieldTouched(
    field: $Keys<Values>,
    isTouched?: boolean,
    shouldValidate?: boolean,
  ): void;
  setFieldTouched(
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean,
  ): void;
  /** Validate form values */
  validateForm(values?: any): void;
  /** Reset form */
  resetForm(nextValues?: any): void;
  /** Submit the form imperatively */
  submitForm(): void;
  /** Set Formik state, careful! */
  setFormikState(
    f: (
      prevState: $ReadOnly<FormikState<Values>>,
      props: any,
    ) => $Shape<FormikState<Values>>,
    callback?: () => any,
  ): void;
}

export type FormikSharedConfig = {
  /** Tells Formik to validate the form on each input's onChange event */
  validateOnChange?: boolean,
  /** Tells Formik to validate the form on each input's onBlur event */
  validateOnBlur?: boolean,
  /** Tell Formik if initial form values are valid or not on first render */
  isInitialValid?: boolean | ((props: {}) => boolean | void),
  /** Should Formik reset the form when new initialValues change */
  enableReinitialize?: boolean,
};

/**
 * Formik computed properties. These are read-only.
 */
export type FormikComputedProps<Values: Object> = {
  /** True if any input has been touched. False otherwise. */
  +dirty: boolean,
  /** Result of isInitiallyValid on mount, then whether true values pass validation. */
  +isValid: boolean,
  /** initialValues */
  +initialValues: Values,
};

/**
 * Formik form event handlers
 */
export type FormikHandlers = {
  /** Form submit handler */
  handleSubmit: (e: SyntheticEvent<any>) => any,
  /** Classic React change handler, keyed by input name */
  handleChange: (e: SyntheticEvent<any>) => any,
  /** Classic React blur handler */
  handleBlur: (e: any) => void,
  /** Reset form event handler  */
  handleReset: () => void,
};

export type FormikProps<Values: Object> = FormikActions<Values> & {|
  ...$Exact<FormikHandlers>,
  ...$Exact<FormikComputedProps<Values>>,
  ...$Exact<FormikState<Values>>,
|};

export type FormikConfig<Values: Object> = {
  ...$Exact<FormikSharedConfig>,
  /**
   * Initial values of the form
   */
  initialValues?: Values,

  /**
   * Submission handler
   */
  onSubmit: (values: Values, formikActions: FormikActions<any>) => any,

  /**
   * Form component to render
   */
  component: React$ComponentType<FormikProps<Values> | void>,

  /**
   * Render prop (works like React router's <Route render={props =>} />)
   */
  render?: (props: FormikProps<Values>) => React$Node,

  /**
   * A Yup Schema or a function that returns a Yup schema
   */
  validationSchema?: any | (() => any),

  /**
   * Validation function. Must return an error object or promise that
   * throws an error object where that object keys map to corresponding value.
   */
  validate?: (values: Values) => null | Object | Promise<any>,

  /**
   * React children or child render callback
   */
  children?: ((props: FormikProps<Values>) => React$Node) | React$Node,
};

export class Formik<
  Values: Object,
  Props: FormikConfig<Values> = FormikConfig<Values>,
> extends React$Component<Props> {}

/**
 * Note: These typings could be more restrictive, but then it would limit the
 * reusability of custom <Field/> components.
 *
 * @example
 * type MyProps = {
 *   ...FieldProps,
 *   ...
 * }
 *
 * export const MyInput = ({
 *   field,
 *   form,
 *   ...props
 * }: MyProps) =>
 *   <div>
 *     <input {...field} {...props}/>
 *     {form.touched[field.name] && form.errors[field.name]}
 *   </div>
 */
export type FieldProps = {
  field: {
    /** Classic React change handler, keyed by input name */
    // TODO: React.ChangeEvent<any>
    onChange: (e: any) => any,
    /** Mark input as touched */
    onBlur: (e: any) => any,
    /** Value of the input */
    value: any,
    /* name of the input */
    name: string,
  },
  form: FormikProps<any>,
};

/*
import * as React from 'react';

type OwnProps = {};
type Props = OwnProps & FormikProps;
class MyFormikHoc extends React.Component<Props> {
   render() {
      const { setFieldValue, status, errors, dirty } = this.props;
   }
}

const enhancer = withFormik({});

// TODO - extract FormikProps from enhancer
type FormikProps = $Call<enhancer, OwnProps>

export default enhancer(MyFormikHoc);
 */

export var Field: React$StatelessFunctionalComponent<any>;

export var Form: React$StatelessFunctionalComponent<any>;
/* eslint-enable */
