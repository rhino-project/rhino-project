import { useCallback, useEffect, useMemo } from 'react';
import { Alert, Form } from 'reactstrap';
import * as yup from 'yup';

import { SuccessAlert } from 'rhino/components/alerts';
import { SubmitButton } from 'rhino/components/buttons';
import { useModelShow, useModelUpdate } from 'rhino/hooks/queries';
import { useFieldSetErrors, useResolver } from 'rhino/hooks/form';
import { useForm } from 'react-hook-form';
import FormProvider from '../forms/FormProvider';
import FieldGroup from '../forms/FieldGroup';

const EditProfile = () => {
  const { model, resource: account } = useModelShow('account', null);
  const { mutate, isLoading, isSuccess, error } = useModelUpdate(model);

  const schema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().label('Name').ensure(),
        nickname: yup.string().label('Nickname').ensure()
      }),
    []
  );

  const defaultValues = useMemo(() => schema.default(), [schema]);
  const resolver = useResolver(schema);

  const methods = useForm({
    defaultValues,
    values: account,
    mode: 'onBlur',
    resolver
  });
  const {
    handleSubmit,
    setError,
    setFocus,
    formState: { isDirty }
  } = methods;

  const onError = useFieldSetErrors(setError);
  const onSubmit = useCallback(
    (values) => mutate(values, { onError }),
    [mutate, onError]
  );

  useEffect(() => setFocus('name'), [setFocus]);

  return (
    <>
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup path="name" label="Name" />
          <FieldGroup path="nickname" label="Nick Name" />
          {Array.isArray(error?.errors) && (
            <Alert color="danger">{error.errors[0]}</Alert>
          )}

          <SubmitButton loading={isLoading} disabled={!isDirty}>
            Update Profile
          </SubmitButton>
        </Form>
      </FormProvider>

      {isSuccess && (
        <SuccessAlert title="Your profile has been updated successfully" />
      )}
    </>
  );
};

export default EditProfile;
