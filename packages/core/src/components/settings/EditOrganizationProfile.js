import { useMemo, useCallback, useEffect } from 'react';
import { Form } from 'reactstrap';
import * as yup from 'yup';

import { SubmitButton } from '../buttons';
import { baseOwnerModel } from '../../utils/models';
import { DangerAlert, SuccessAlert } from '../alerts';
import { useBaseOwner, useBaseOwnerId } from '../../hooks/owner';
import { useModelShow, useModelUpdate } from '../../hooks/queries';
import { FormProvider } from '../forms/FormProvider';
import { useFieldSetErrors, useResolver } from '../../hooks/form';
import { useForm } from 'react-hook-form';
import { FieldGroupString } from '../forms/fieldGroups/FieldGroupString';

export const EditOrganizationProfile = () => {
  const baseOwner = useBaseOwner();
  const model = baseOwnerModel();
  const baseOwnerId = useBaseOwnerId();
  const { mutate, isLoading, isSuccess, error } = useModelUpdate(model);
  const { resource: owner } = useModelShow(model, baseOwnerId);

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
          <FieldGroupString path="name" label="Name" />
          {Array.isArray(error?.errors) && (
            <DangerAlert title={error.errors[0]} />
          )}

          <SubmitButton loading={isLoading} disabled={!isDirty}>
            {`Update ${baseOwner.name}`}
          </SubmitButton>
        </Form>
      </FormProvider>

      {isSuccess && (
        <SuccessAlert
          title={`${baseOwner.name} has been updated successfully`}
        />
      )}
    </>
  );
};
