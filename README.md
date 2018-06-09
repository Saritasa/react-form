# @saritasa/react-form
This is a package for simple form building.

Install:
```bash
npm install @saritasa/react-form
```

Available components:
- Form
- FormField
- FormFieldError
- FormError
- FormOuterControlsProvider

Available methods:
- createFieldRules


## Components

### `<Form />`

`<Form>` is a component that helps you with building forms.

```js
import React from 'react';
import { Form } from '@saritasa/react-form';

const View = props => (
  <form onSubmit={props.onSubmit}>
    <input
       type="text"
     onChange={props.onChange}
     onBlur={props.onBlur}
     value={props.values.name}
     name="name"
   />
   {props.errors.name && <div id="feedback">{props.errors.name}</div>}
   <button type="submit">Submit</button>
 </form>
); 

const handleSubmit = (values, actions) => {
 setTimeout(() => {
   alert(JSON.stringify(values, null, 2));
   actions.setSubmitting(false);
 }, 1000);
};

const BasicExample = () => (
  <div>
    <h1>My Form</h1>
    <Form
      initialValues={{ name: 'jared' }}
      onSubmit={handleSubmit}
      component={View}
    />
  </div>
);
```

#### Form's View props

All three render methods will be passed the same props:

##### `dirty: boolean`

Returns `true` if values are not deeply equal from initial values, `false` otherwise.
`dirty` is a readonly computed property and should not be mutated directly.

##### `errors: { [field: string]: ?string }`

Form validation errors. Should match the shape of your form's [`values`] defined
in `initialValues`.

##### `error: ?string`

Form validation errors. Should match the shape of your form's [`values`] defined
in `initialValues`.

##### `onBlur: (event: SyntheticFocusEvent<HTMLElement>) => void`

`onBlur` event handler. Useful for when you need to track whether an input has
been [`touched`] or not. This should be passed to `<input onBlur={handleBlur} ... />`

DOM-only. Use [`setFieldTouched`] in React Native.

##### `onChange: (event: SyntheticInputEvent<HTMLElement>) => void`

General input change event handler. This will update the `values[key]` where
`key` is the event-emitting input's `name` attribute. If the `name` attribute is
not present, `handleChange` will look for an input's `id` attribute. Note:
"input" here means all HTML inputs.

DOM-only. Use [`setFieldValue`] in React Native.

##### `onReset: () => void`

Reset handler. Will reset the form to its initial state. This should be passed
to `<button onClick={handleReset}>...</button>`

##### `onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void`

Submit handler. This should be passed to `<form onSubmit={props.onSubmit}>...</form>`

##### `submitting: boolean`

Submitting state. Either `true` or `false`. Form will set this to `true` on
your behalf before calling [`onSubmit`] to reduce boilerplate.

##### `valid: boolean`

Returns `true` if the there are no [`errors`], or the result of
[`initialValid`] the form if is in "pristine" condition (i.e. not [`dirty`])).

##### `resetForm: (nextValues?: Values) => void`

Imperatively reset the form. This will clear [`errors`] and [`touched`], set
[`submitting`] to `false` and rerun `mapPropsToValues` with the current
`WrappedComponent`'s `props` or what's passed as an argument. The latter is
useful for calling `resetForm` within `componentWillReceiveProps`.

##### `setErrors: (fields: { [field: string]: ?string }) => void`

Set `errors` imperatively.

##### `setFieldError: (field: string, errorMsg: ?string) => void`

Set the error message of a field imperatively. `field` should match the key of
[`errors`] you wish to update. Useful for creating custom input error handlers.

##### `setFieldTouched: (field: string, isTouched: boolean, shouldValidate?: boolean) => void`

Set the touched state of a field imperatively. `field` should match the key of
[`touched`] you wish to update. Useful for creating custom input blur handlers. Calling this method will trigger validation to run if [`validateOnBlur`] is set to `true` (which it is by default). You can also explicitly prevent/skip validation by passing a third argument as `false`.

##### `submitForm: () => void`

Trigger a form submission.

##### `setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void`

Set the value of a field imperatively. `field` should match the key of
[`values`] you wish to update. Useful for creating custom input change handlers. Calling this will trigger validation to run if [`validateOnChange`] is set to `true` (which it is by default). You can also explicitly prevent/skip validation by passing a third argument as `false`.

##### `setStatus: (status?: any) => void`

Set a top-level [`status`] to anything you want imperatively. Useful for
controlling arbitrary top-level state related to your form. For example, you can
use it to pass API responses back into your component in [`onSubmit`].

##### `setSubmitting: (submitting: boolean) => void`

Set [`submitting`] imperatively.

##### `setTouched: (fields: { [field: string]: boolean }) => void`

Set [`touched`] imperatively.

##### `setValues: (fields: { [field: string]: any }) => void`

Set [`values`] imperatively.

##### `status?: any`

A top-level status object that you can use to represent form state that can't
otherwise be expressed/stored with other methods. This is useful for capturing
and passing through API responses to your inner component.

`status` should only be modifed by calling
[`setStatus: (status?: any) => void`](#setstatus-status-any--void)

##### `touched: { [field: string]: boolean }`

Touched fields. Each key corresponds to a field that has been touched/visited.

##### `values: { [field: string]: any }`

Your form's values. Will have the shape of the result of [`mapPropsToValues`]
(if specified) or all props that are not functions passed to your wrapped
component.

##### `validateForm: (values?: any) => void`

Imperatively call your [`validate`] or [`validateSchema`] depending on what was specified. You can optionally pass values to validate against and this modify Form state accordingly, otherwise this will use the current `values` of the form.

#### `component`

```flow js
<Form component={ContactForm} />;

const ContactForm = ({
  onSubmit,
  onChange,
  onBlur,
  values,
  errors,
}) => (
  <form onSubmit={onSubmit}>
    <input
      type="text"
      onChange={onChange}
      onBlur={onBlur}
      value={values.name}
      name="name"
    />
    {errors.name && <div>{errors.name}</div>}
    <button type="submit">Submit</button>
  </form>
);
```

#### `enableReinitialize?: boolean`

Default is `false`. Control whether Form should reset the form if
[`initialValues`] changes (using deep equality).

#### `initialValid?: boolean`

Default is `false`. Control the initial value of [`isValid`] prop prior to
mount. You can also pass a function. Useful for situations when you want to
enable/disable a submit and reset buttons on initial mount.

#### `initialValues?: Values`

Initial field values of the form, Form will make these values available to
render methods component as [`props.values`][`values`].

Even if your form is empty by default, you must initialize all fields with
initial values otherwise React will throw an error saying that you have changed
an input from uncontrolled to controlled.

Note: `initialValues` not available to the higher-order component, use
[`mapPropsToValues`] instead.

#### `onReset?: (values: Values, formBag: FormBag) => void`

Your optional form reset handler. It is passed your forms [`values`] and the
"FormBag".

#### `onSubmit: (values: Values, formBag: FormBag) => void`

Your form submission handler. It is passed your forms [`values`] and the
"FormBag", which includes an object containing a subset of the
[injected props and methods](#injected-props-and-methods) (i.e. all the methods
with names that start with `set<Thing>` + `resetForm`) and any props that were
passed to the the wrapped component.

Note: [`errors`], [`touched`], [`status`] and all event handlers are NOT
included in the `FormBag`.

#### `validate?: (values: Values) => FormErrors<Values> | Promise<any>`

_Note: I suggest using [`validationSchema`] and Yup for validation. However,
`validate` is a dependency-free, straightforward way to validate your forms._

Validate the form's [`values`] with function. This function can either be:

1. Synchronous and return an [`errors`] object.

```js
// Synchronous validation
const validate = (values, props) => {
  let errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  //...

  return errors;
};
```

* Asynchronous and return a Promise that's error in an [`errors`] object

```js
// Async Validation
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const validate = (values, props) => {
  return sleep(2000).then(() => {
    let errors = {}
    if (['admin', 'null', 'god'].includes(values.username)) {
      errors.username = 'Nice try'
    }
    // ...
    if (Object.keys(errors).length) {
      throw errors
    }
  })
}
```

#### `validateOnBlur?: boolean`

Default is `true`. Use this option to run validations on `blur` events. More
specifically, when either [`handleBlur`], [`setFieldTouched`], or [`setTouched`]
are called.

#### `validateOnChange?: boolean`

Default is `true`. Use this option to tell Form to run validations on `change`
events and `change`-related methods. More specifically, when either
[`handleChange`], [`setFieldValue`], or [`setValues`] are called.

#### `validationSchema?: Schema | (() => Schema)`

[A Yup schema](https://github.com/jquense/yup) or a function that returns a Yup
schema. This is used for validation. Errors are mapped by key to the inner
component's [`errors`]. Its keys should match those of [`values`].


## Methods

### `createFieldRules()`

```flow js
import { createFieldRules } from 'components/base/Form';

function myRule(values) {
  if (values.a === 1) {
    return { ...values, b: 2 };
  }

  return values;
}

function mySecondRule(values) {
  if (values.b === 2) {
    return { ...values, c: 3 };
  }

  return values;
}

function myBrokenRule(values) {
  if (values.a === 1) {
    values.b = 2; // <<--- This pattern is forbidden. Always create new object in case of any change.
  }

  return values;
}

const r1 = createFieldRules(myRule);
const r2 = createFieldRules([myRule]);
const r3 = createFieldRules([myRule, mySecondRule]);
const r4 = createFieldRules([mySecondRule, myRule]);
const r5 = createFieldRules(myBrokenRule);

r1({ a: 1, b: 1 }) // { a;
r1({ a: 0, b: 1 });
r5({ a: 1, b: 1 });

```

