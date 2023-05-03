import { Children, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { EDIT_CANCEL } from 'config';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelEditContext } from 'rhino/hooks/controllers';
import { useFormContext } from 'react-hook-form';
import { useFieldSetErrors } from 'rhino/hooks/form';
import { IconButton } from '../buttons';
import { useBackHistory, useBaseOwnerNavigation } from '../../hooks/history';
import withGlobalOverrides, { useOverrides } from '../../hooks/overrides';
import { getModelShowPath } from '../../utils/routes';

export const ModelEditActionSave = ({ children, onSave, ...props }) => {
  const { mutate, isLoading } = useModelEditContext();
  const { handleSubmit } = useFormContext();

  const onSuccess = useCallback(
    (data) => {
      if (onSave) return onSave(data);
    },
    [onSave]
  );

  const onError = useFieldSetErrors();

  const handleClick = useCallback(
    () => handleSubmit((values) => mutate(values, { onSuccess, onError }))(),
    [mutate, handleSubmit, onError, onSuccess]
  );

  return (
    <IconButton
      color="primary"
      icon="save"
      loading={isLoading}
      onClick={handleClick}
      {...props}
    >
      {children || 'Save'}
    </IconButton>
  );
};

export const ModelEditActionSaveShow = ({ onSave, ...props }) => {
  const { model } = useModelEditContext();
  const { push } = useBaseOwnerNavigation();
  const handleSave = useCallback(
    (data) => {
      const showPath = getModelShowPath(model, data.id);

      if (onSave) onSave(data);

      push(showPath);
    },
    [model, push, onSave]
  );

  return <ModelEditActionSave onSave={handleSave} {...props} />;
};

export const ModelEditActionSaveBack = ({ onSave, ...props }) => {
  const backHistory = useBackHistory();
  const handleSave = useCallback(
    (data) => {
      if (onSave) onSave(data);

      backHistory();
    },
    [backHistory, onSave]
  );

  return <ModelEditActionSave onSave={handleSave} {...props} />;
};

export const ModelEditActionCancel = ({ children, onCancel, ...props }) => {
  const backHistory = useBackHistory();
  const handleClick = useCallback(
    () => (onCancel ? onCancel() : backHistory()),
    [onCancel, backHistory]
  );

  return (
    <IconButton outline icon="x-square" onClick={handleClick} {...props}>
      {children || 'Cancel'}
    </IconButton>
  );
};

const defaultComponents = {
  ModelEditActionCancel,
  ModelEditActionSave: ModelEditActionSaveShow
};

export const ModelEditActionsBase = ({
  overrides,
  children,
  actions,
  append = false,
  prepend = false,
  hasCancel,
  ...props
}) => {
  const { ModelEditActionCancel, ModelEditActionSave } = useOverrides(
    defaultComponents,
    overrides
  );
  const { model } = useModelEditContext();

  const computedDefaultActions = useMemo(
    () =>
      [hasCancel && <ModelEditActionCancel />, <ModelEditActionSave />].filter(
        Boolean
      ),
    [hasCancel]
  );

  const computedActions = useMemo(() => {
    if (!actions) return computedDefaultActions;

    if (append)
      return [...computedDefaultActions, ...Children.toArray(actions)];

    if (prepend)
      return [...Children.toArray(actions), ...computedDefaultActions];

    return actions;
  }, [actions, append, prepend, computedDefaultActions]);

  return (
    <ModelWrapper model={model} baseClassName="Edit-actions">
      <div
        className="d-flex flex-row flex-wrap justify-content-between mb-3"
        {...props}
      >
        {Children.map(computedActions, (action) => action)}
      </div>
    </ModelWrapper>
  );
};

ModelEditActionsBase.propTypes = {
  hasCancel: PropTypes.bool.isRequired
};

ModelEditActionsBase.defaultProps = {
  hasCancel: EDIT_CANCEL
};

const ModelEditActions = withGlobalOverrides(ModelEditActionsBase);

export default ModelEditActions;
