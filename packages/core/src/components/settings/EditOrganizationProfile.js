import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import { SubmitButton } from 'rhino/components/buttons';
import { baseOwnerModel } from 'rhino/utils/models';
import { SuccessAlert } from 'rhino/components/alerts';
import { useBaseOwner, useBaseOwnerId } from 'rhino/hooks/owner';
import { useModelShow, useModelUpdate } from 'rhino/hooks/queries';

const EditOrganizationProfileForm = ({
  resource,
  loading,
  errors,
  onSubmit
}) => {
  const [formValues, setFormValues] = useState(resource);
  useEffect(() => {
    setFormValues(resource);
  }, [resource]);

  const handleChange = ({ target: { id, value } }) =>
    setFormValues({ ...formValues, [id]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  const createField = (id, label, type = 'text', value) => (
    <FormGroup>
      <Label for={id}>{label}</Label>
      <Input
        type={type}
        name={id}
        id={id}
        value={value}
        placeholder={label}
        invalid={errors?.[id]}
        onChange={handleChange}
      />
      <FormFeedback>{errors?.[id]}</FormFeedback>
    </FormGroup>
  );

  return (
    <Form onSubmit={handleSubmit}>
      {createField('name', 'Name', 'text', formValues?.name)}
      {Array.isArray(errors) && <Alert color="danger">{errors[0]}</Alert>}

      <SubmitButton loading={loading}>Update Profile</SubmitButton>
    </Form>
  );
};

EditOrganizationProfileForm.propTypes = {
  errors: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

const EditOrganizationProfile = () => {
  const baseOwner = useBaseOwner();
  const model = baseOwnerModel();
  const baseOwnerId = useBaseOwnerId();
  const {
    mutate: resourceUpdate,
    isLoading,
    isSuccess,
    error
  } = useModelUpdate(model);
  const { data: { data: resource } = {} } = useModelShow(model, baseOwnerId);

  const handleSubmit = (formValues) =>
    resourceUpdate({ id: baseOwnerId, ...formValues });

  return (
    <>
      <EditOrganizationProfileForm
        resource={resource}
        id={baseOwnerId}
        primaryAction={`Update ${baseOwner.name}`}
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
      />
      {isSuccess && (
        <SuccessAlert
          title={`${baseOwner.name} has been updated successfully`}
        />
      )}
    </>
  );
};

export default EditOrganizationProfile;
