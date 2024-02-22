import { useCallback, useEffect, useMemo } from 'react';
import { Form } from 'reactstrap';
import * as yup from 'yup';

import { DangerAlert, SuccessAlert } from '../alerts';
import { SubmitButton } from '../buttons';
import { useModelShow, useModelUpdate } from '../../hooks/queries';
import { useFieldSetErrors, useResolver } from '../../hooks/form';
import { useForm } from 'react-hook-form';
import FormProvider from '../forms/FormProvider';
import FieldGroupString from '../forms/fieldGroups/FieldGroupString';

export const EditProfile = () => {
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
    disabled: isLoading,
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
          <FieldGroupString path="name" label="Name" />
          <FieldGroupString path="nickname" label="Nick Name" />
          {Array.isArray(error?.errors) && (
            <DangerAlert title={error.errors[0]} />
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
