import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { CREATE_CANCEL } from 'config';
import { useOverrides, useOverridesWithGlobal } from 'rhino/hooks/overrides';
import { useControlledForm, useComputedPaths } from 'rhino/hooks/form';
import {
  getParentModel,
  getCreatableAttributes,
  isBaseOwned
} from 'rhino/utils/models';
import {
  breadcrumbFor,
  buildCancelAction,
  buildSaveAction
} from 'rhino/utils/ui';
import ModelActions from 'rhino/components/models/ModelActions';
import ModelForm from 'rhino/components/models/ModelForm';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelCreate, useModelShow } from 'rhino/hooks/queries';

export const ModelCreateHeader = (props) => {
  const { model, resource } = props;

  // Fetch the parent model for the owner value and the breadcrumb
  const parentModel = useMemo(() => getParentModel(model), [model]);
  const { [parentModel.model]: parentId } = resource;

  const { resource: parent } = useModelShow(parentModel, parentId);

  const breadcrumbs = () => {
    if (!parent || isBaseOwned(model)) return [];

    return breadcrumbFor(parentModel, parent, true);
  };

  return (
    <ModelWrapper {...props} baseClassName="create-header">
      {breadcrumbs()}
    </ModelWrapper>
  );
};

ModelCreateHeader.propTypes = {
  model: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  overrides: PropTypes.object
};

const defaultFormComponents = {
  ModelForm
};

export const ModelCreateForm = ({ overrides, ...props }) => {
  const { values } = props;
  const { ModelForm } = useOverrides(defaultFormComponents, overrides);

  return (
    <ModelWrapper {...props} baseClassName="create-form">
      <ModelForm {...props} resource={values} />
    </ModelWrapper>
  );
};

ModelCreateForm.propTypes = {
  values: PropTypes.object.isRequired,
  overrides: PropTypes.object
};

export const ModelCreateActions = (props) => {
  const {
    actions,
    model,
    hasCancel,
    onActionSuccess,
    onActionError,
    values
  } = props;

  // Actions
  const { mutate, isLoading: isSaving } = useModelCreate(model);

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
    [mutate, onActionSuccess, onActionError, props, values]
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
    <ModelWrapper {...props} baseClassName="create-actions">
      <ModelActions {...props} actions={computedActions} />
    </ModelWrapper>
  );
};

ModelCreateActions.propTypes = {
  model: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  actions: PropTypes.array,
  hasCancel: PropTypes.bool.isRequired,
  onActionError: PropTypes.func.isRequired,
  onActionSuccess: PropTypes.func.isRequired
};

ModelCreateActions.defaultProps = {
  hasCancel: CREATE_CANCEL
};

const defaultComponents = {
  ModelCreateHeader,
  ModelCreateForm,
  ModelCreateActions
};

const ModelCreate = ({ overrides, ...props }) => {
  const { model, paths, resource, onActionError } = props;
  const {
    ModelCreateHeader,
    ModelCreateForm,
    ModelCreateActions
  } = useOverridesWithGlobal(model, 'create', defaultComponents, overrides);

  const [values, , errors, setErrors, handleChange] = useControlledForm(
    resource
  );
  const computedPaths = useComputedPaths(model, paths, getCreatableAttributes);

  const handlActionError = (action, props, error) => {
    setErrors(error?.errors);

    // We intercept but then forward on
    if (onActionError) onActionError(action, error, props);
  };

  return (
    <ModelWrapper {...props} baseClassName="create">
      <ModelCreateHeader
        {...props}
        resource={resource}
        values={values}
        paths={computedPaths}
      />
      <ModelCreateForm
        {...props}
        errors={errors}
        values={values}
        paths={computedPaths}
        onChange={handleChange}
      />
      <ModelCreateActions
        {...props}
        values={values}
        paths={computedPaths}
        onChange={handleChange}
        onActionError={handlActionError}
      />
    </ModelWrapper>
  );
};

ModelCreate.propTypes = {
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object,
  paths: PropTypes.array,
  resource: PropTypes.object.isRequired,
  onActionError: PropTypes.func
};

ModelCreate.defaultProps = {
  resource: {}
};

export default ModelCreate;
