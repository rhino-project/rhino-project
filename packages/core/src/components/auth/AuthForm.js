import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Form } from 'reactstrap';
import * as yup from 'yup';

import { useParsedSearch } from 'rhino/hooks/history';
import { LinkButton } from 'rhino/components/buttons';
import FormProvider from '../forms/FormProvider';
import { useForm } from 'react-hook-form';
import FieldGroup from '../forms/FieldGroup';
import FieldGroupPassword from '../forms/fieldGroups/FieldGroupPassword';
import { useResolver } from 'rhino/hooks/form';
import { DangerAlert } from '../alerts';

const AuthField = (props) => <FieldGroup {...props} />;
const AuthFieldPassword = (props) => <FieldGroupPassword {...props} />;

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

  // Autocomplete attributes to match Chrome standards
  // https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands/
  const passwordDescriptor = useMemo(
    () => `${currentPasswordField ? 'New ' : ''}Password`,
    [currentPasswordField]
  );

  const passwordComplete = useMemo(
    () => `${passwordConfirmField ? 'new' : 'current'}-password`,
    [passwordConfirmField]
  );

  // Unused fields can't be set or they will cause errors
  const schema = useMemo(() => {
    let schema = yup.object().shape({});

    if (emailField)
      schema = schema.shape({
        email: yup.string().label('Email').email().required().ensure()
      });
    if (currentPasswordField)
      schema = schema.shape({
        current_password: yup
          .string()
          .label(passwordDescriptor)
          .required()
          .ensure()
      });
    if (passwordField)
      schema = schema.shape({
        password: yup.string().label(passwordDescriptor).required().ensure()
      });
    if (passwordConfirmField)
      schema = schema.shape({
        password_confirmation: yup
          .string()
          .label('Confirm Password')
          .oneOf([yup.ref('password'), null], 'Passwords must match')
          .required()
          .ensure()
      });
    if (organizationField)
      schema = schema.shape({
        organization: yup.string().label('Organization').ensure()
      });

    return schema;
  }, [
    emailField,
    currentPasswordField,
    organizationField,
    passwordField,
    passwordConfirmField,
    passwordDescriptor
  ]);

  const defaultValues = useMemo(() => schema.default(), [schema]);
  const resolver = useResolver(schema);

  const methods = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver
  });
  const { handleSubmit, setFocus } = methods;

  // FIXME: shouldSelect: true does not seem to work - autocomplete issue?
  useEffect(() => {
    const focusOptions = { shouldSelect: true };

    if (currentPasswordField) {
      setFocus('current_password', focusOptions);
    } else if (emailField) {
      setFocus('email', focusOptions);
    } else if (passwordField) {
      setFocus('password', focusOptions);
    }
  }, [currentPasswordField, emailField, passwordField, setFocus]);

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {currentPasswordField && (
          <AuthFieldPassword
            path="current_password"
            label="Current Password"
            autoComplete="current-password"
          />
        )}
        {emailField && (
          <AuthField
            path="email"
            label="Email"
            autoComplete="username"
            type="email"
          />
        )}
        {passwordField && (
          <AuthFieldPassword
            path="password"
            label={passwordDescriptor}
            autoComplete={passwordComplete}
          />
        )}
        {passwordConfirmField && (
          <AuthFieldPassword
            path="password_confirmation"
            label={`Confirm ${passwordDescriptor}`}
            autoComplete={passwordComplete}
          />
        )}
        {organizationField && (
          <AuthField
            path="organization"
            label="Organization"
            autoComplete="organizaton"
          />
        )}

        {(Array.isArray(errors) || omniError) && (
          <DangerAlert title={omniError || errors[0]} />
        )}

        <div className="d-flex flex-column">
          {secondaryAction && (
            <LinkButton
              className={`mb-2 text-right ${secondaryAction.className}`}
              color="link"
              to={secondaryAction.url}
            >
              {secondaryAction.content}
            </LinkButton>
          )}
          <Button className={primaryAction.className} loading={loading}>
            {primaryAction.content}
          </Button>
        </div>
      </Form>
    </FormProvider>
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
  primaryAction: PropTypes.object.isRequired,
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
