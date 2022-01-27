import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';

import { EDIT_CANCEL } from 'config';
import { useOverrides, useOverridesWithGlobal } from 'rhino/hooks/overrides';
import { useControlledForm, useComputedPaths } from 'rhino/hooks/form';
import { getUpdatableAttributes } from 'rhino/utils/models';
import {
  breadcrumbFor,
  buildCancelAction,
  buildSaveAction
} from 'rhino/utils/ui';
import ModelActions from 'rhino/components/models/ModelActions';
import ModelForm from 'rhino/components/models/ModelForm';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelShow, useModelUpdate } from 'rhino/hooks/queries';

export const ModelEditHeader = (props) => {
  const { model, resource } = props;

  return (
    <ModelWrapper {...props} baseClassName="edit-header">
      {breadcrumbFor(model, resource, true)}
    </ModelWrapper>
  );
};

ModelEditHeader.propTypes = {
  model: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  overrides: PropTypes.object
};

const defaultFormComponents = {
  ModelForm
};

export const ModelEditForm = ({ overrides, ...props }) => {
  const { values } = props;
  const { ModelForm } = useOverrides(defaultFormComponents, overrides);

  return (
    <ModelWrapper {...props} baseClassName="edit-form">
      <ModelForm {...props} resource={values} />
    </ModelWrapper>
  );
};

ModelEditForm.propTypes = {
  values: PropTypes.object.isRequired,
  overrides: PropTypes.object
};

export const ModelEditActions = (props) => {
  const {
    actions,
    model,
    onActionSuccess,
    onActionError,
    hasCancel,
    values
  } = props;

  // Actions
  const { mutate, isLoading: isSaving } = useModelUpdate(model);

  const handleAction = useCallback(
    (action) =>
      mutate(values, {
        onSuccess: (data) => {
          if (onActionSuccess) onActionSuccess(action, props, data);
        },
        onError: (error) => {
          if (onActionError) onActionError(action, props, error);
        }
      }),
    [mutate, onActionSuccess, onActionError, values, props]
  );

  const computedActions = useMemo(() => {
    if (actions) return actions;

    const defaultActions = [
      buildSaveAction({
        loading: isSaving,
        disabled: isSaving,
        onAction: handleAction
      })
    ];

    if (hasCancel) {
      defaultActions.unshift(
        buildCancelAction({
          onAction: () => onActionSuccess('cancel', props)
        })
      );
    }

    return defaultActions;
  }, [actions, isSaving, hasCancel, handleAction, onActionSuccess, props]);

  return (
    <ModelWrapper {...props} baseClassName="edit-actions">
      <ModelActions {...props} actions={computedActions} />
    </ModelWrapper>
  );
};

ModelEditActions.propTypes = {
  model: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  actions: PropTypes.array,
  hasCancel: PropTypes.bool.isRequired,
  onActionError: PropTypes.func.isRequired,
  onActionSuccess: PropTypes.func.isRequired
};

ModelEditActions.defaultProps = {
  hasCancel: EDIT_CANCEL
};

const defaultComponents = {
  ModelEditHeader,
  ModelEditForm,
  ModelEditActions
};

const ModelEdit = ({ overrides, ...props }) => {
  const {
    model,
    resource: { id: modelId },
    onActionError,
    paths
  } = props;
  const {
    ModelEditHeader,
    ModelEditForm,
    ModelEditActions
  } = useOverridesWithGlobal(model, 'edit', defaultComponents, overrides);

  const { isLoading, data: { data: resource = {} } = {} } = useModelShow(
    model,
    modelId
  );

  const [values, , errors, setErrors, handleChange] = useControlledForm(
    resource
  );
  const computedPaths = useComputedPaths(model, paths, getUpdatableAttributes);

  const handlActionError = (action, props, error) => {
    setErrors(error?.errors);

    // We intercept but then forward on
    if (onActionError) onActionError(error);
  };

  if (isLoading) {
    return <Spinner className="mx-auto d-block" />;
  }

  return (
    <ModelWrapper {...props} baseClassName="edit">
      <ModelEditHeader
        {...props}
        resource={resource}
        values={values}
        paths={computedPaths}
      />
      <ModelEditForm
        {...props}
        errors={errors}
        values={values}
        paths={computedPaths}
        onChange={handleChange}
      />
      <ModelEditActions
        {...props}
        values={values}
        paths={computedPaths}
        onActionError={handlActionError}
      />
    </ModelWrapper>
  );
};

ModelEdit.propTypes = {
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object,
  paths: PropTypes.array,
  resource: PropTypes.object.isRequired,
  onActionError: PropTypes.func
};

export default ModelEdit;
