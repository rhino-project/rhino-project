import { SuccessAlert } from 'rhino/components/alerts';
import { SubmitButton } from 'rhino/components/buttons';
import { useModel } from 'rhino/hooks/models';
import { useModelShow, useModelUpdate } from 'rhino/hooks/queries';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Alert, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';

const EditProfileForm = ({ resource, loading, errors, onSubmit }) => {
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
      {createField('nickname', 'Nickname', 'text', formValues?.nickname)}
      {Array.isArray(errors) && <Alert color="danger">{errors[0]}</Alert>}

      <SubmitButton loading={loading}>Update Profile</SubmitButton>
    </Form>
  );
};

EditProfileForm.propTypes = {
  errors: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired
};

const EditProfile = () => {
  const model = useModel('account');
  const {
    mutate: resourceUpdate,
    isLoading,
    isSuccess,
    error
  } = useModelUpdate(model);
  const { data: { data: resource } = {} } = useModelShow(model, null);

  const handleSubmit = (formValues) => resourceUpdate({ ...formValues });

  return (
    <>
      <EditProfileForm
        resource={resource}
        primaryAction="Update Profile"
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
      />
      {isSuccess && (
        <SuccessAlert title="Your profile has been updated successfully" />
      )}
    </>
  );
};

export default EditProfile;
