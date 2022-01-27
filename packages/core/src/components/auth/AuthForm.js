import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import { useParsedSearch } from 'rhino/hooks/history';
import { LinkButton, SubmitButton } from 'rhino/components/buttons';

const AuthForm = ({
  emailField,
  currentPasswordField,
  organizationField,
  passwordField,
  passwordConfirmField,
  primaryAction,
  secondaryAction,
  loading,
  errors,
  onSubmit
}) => {
  const queryParams = useParsedSearch();
  const omniError = queryParams?.error;

  // Unused fields can't be set or they will cause errors
  const initValues = {};

  if (emailField) initValues.email = '';
  if (currentPasswordField) initValues.current_password = '';
  if (passwordField) initValues.password = '';
  if (passwordConfirmField) initValues.password_confirmation = '';

  const [formValues, setFormValues] = useState(initValues);

  const handleChange = ({ target: { id, value } }) =>
    setFormValues({ ...formValues, [id]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  const createAuthField = (
    id,
    label,
    autocomplete = '',
    type = 'password',
    autofocus = false
  ) => (
    <FormGroup>
      <Label for={id}>{label}</Label>
      <Input
        type={type}
        name={id}
        id={id}
        placeholder={label}
        autoFocus={autofocus}
        invalid={errors?.[id]}
        onChange={handleChange}
        autoComplete={autocomplete}
      />
      <FormFeedback>{errors?.[id]}</FormFeedback>
    </FormGroup>
  );

  const passwordDescriptor = `${currentPasswordField ? 'New ' : ''}Password`;
  const passwordComplete = `${
    passwordConfirmField ? 'new' : 'current'
  }-password`;
  return (
    <Form onSubmit={handleSubmit}>
      {currentPasswordField &&
        createAuthField(
          'current_password',
          'Current Password',
          'current-password'
        )}
      {emailField &&
        createAuthField('email', 'Email', 'username', 'email', true)}
      {passwordField &&
        createAuthField('password', passwordDescriptor, passwordComplete)}
      {passwordConfirmField &&
        createAuthField(
          'password_confirmation',
          `Confirm ${passwordDescriptor}`,
          passwordComplete
        )}
      {organizationField &&
        createAuthField(
          'organization',
          'Organization',
          'organizaton',
          'text',
          false
        )}

      {(Array.isArray(errors) || omniError) && (
        <Alert color="danger">{omniError || errors[0]}</Alert>
      )}

      {secondaryAction && (
        <LinkButton color="link" to={secondaryAction.url}>
          {secondaryAction.content}
        </LinkButton>
      )}
      <SubmitButton loading={loading}>{primaryAction}</SubmitButton>
    </Form>
  );
};

AuthForm.propTypes = {
  currentPasswordField: PropTypes.bool.isRequired,
  errors: PropTypes.array,
  emailField: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  organizationField: PropTypes.bool.isRequired,
  passwordField: PropTypes.bool.isRequired,
  passwordConfirmField: PropTypes.bool.isRequired,
  primaryAction: PropTypes.string.isRequired,
  secondaryAction: PropTypes.object
};

AuthForm.defaultProps = {
  currentPasswordField: false,
  emailField: false,
  loading: false,
  organizationField: false,
  passwordField: false,
  passwordConfirmField: false
};

export default AuthForm;
