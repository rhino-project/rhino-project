import { useCallback, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';

import { SubmitButton } from '../buttons';
import {
  useModelShow,
  useModelUpdate,
  useFieldSetErrors,
  useResolver
} from '@rhino-project/core/hooks';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@rhino-project/core/components/forms';
import { FieldString } from '../../Field';
import { Alert, Form } from '@heroui/react';
import { FormErrors } from '../forms';

export const EditProfile = () => {
  const { model, resource: account } = useModelShow('account', null);
  const { mutate, isPending, isSuccess, error } = useModelUpdate(model);

  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => setShowAlert(isSuccess), [isSuccess]);

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
    disabled: isPending,
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
          <FormErrors />
          <FieldString path="name" label="Name" />
          <FieldString path="nickname" label="Nick Name" />
          {Array.isArray(error?.errors) && (
            <Alert color="danger" title={error.errors[0]} />
          )}

          <SubmitButton isLoading={isPending} disabled={!isDirty}>
            Update Profile
          </SubmitButton>
        </Form>
      </FormProvider>

      <Alert
        color="success"
        title="Your profile has been updated successfully"
        isClosable
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </>
  );
};
