import { useMemo, useCallback, useEffect, useState } from 'react';
import { Alert, Form } from '@heroui/react';
import * as yup from 'yup';

import { SubmitButton } from '../buttons';
import { baseOwnerModel } from '@rhino-project/core/utils';
import {
  useBaseOwner,
  useBaseOwnerId,
  useModelShow,
  useModelUpdate,
  useFieldSetErrors,
  useResolver
} from '@rhino-project/core/hooks';
import { FormProvider } from '@rhino-project/core/components/forms';
import { useForm } from 'react-hook-form';
import { FieldString } from '../../Field';

export const EditOrganizationProfile = () => {
  const baseOwner = useBaseOwner();
  const model = baseOwnerModel();
  const baseOwnerId = useBaseOwnerId();
  const { mutate, isLoading, isSuccess, error } = useModelUpdate(model);
  const { resource: owner } = useModelShow(model, baseOwnerId);

  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => setShowAlert(isSuccess), [isSuccess]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().label('Name').ensure()
      }),
    []
  );

  const defaultValues = useMemo(() => schema.default(), [schema]);
  const resolver = useResolver(schema);

  const methods = useForm({
    defaultValues,
    values: owner,
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
          <FieldString path="name" label="Name" />
          {Array.isArray(error?.errors) && (
            <Alert color="danger" title={error.errors[0]} />
          )}

          <SubmitButton isLoading={isLoading} disabled={!isDirty}>
            {`Update ${baseOwner.name}`}
          </SubmitButton>
        </Form>
      </FormProvider>

      <Alert
        color="success"
        title={`${baseOwner.name} has been updated successfully`}
        isClosable
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </>
  );
};
