import { Children, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useModelCreateContext } from '../../hooks/controllers';
import { useFormContext } from 'react-hook-form';
import { useBackHistory, useBaseOwnerNavigation } from '../../hooks/history';
import { IconButton } from '../buttons';
import {
  useGlobalComponentForModel,
  useOverrides
} from '../../hooks/overrides';
import { getModelShowPath } from '../../utils/routes';
import { ModelSection } from './ModelSection';

export const ModelCreateActionSave = ({ children, onSave, ...props }) => {
  const { isLoading, mutate } = useModelCreateContext();
  const { handleSubmit } = useFormContext();

  const onSuccess = useCallback(
    (data) => {
      if (onSave) return onSave(data);
    },
    [onSave]
  );

  const handleClick = useCallback(
    () => handleSubmit((values) => mutate(values, { onSuccess }))(),
    [mutate, handleSubmit, onSuccess]
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

export const ModelCreateActionSaveShow = ({ onSave, ...props }) => {
  const { model } = useModelCreateContext();
  const { push } = useBaseOwnerNavigation();

  const handleSave = useCallback(
    (data) => {
      const showPath = getModelShowPath(model, data.id);

      if (onSave) onSave(data);

      push(showPath);
    },
    [model, push, onSave]
  );

  return <ModelCreateActionSave onSave={handleSave} {...props} />;
};

export const ModelCreateActionSaveBack = ({ onSave, ...props }) => {
  const backHistory = useBackHistory();
  const handleSave = useCallback(
    (data) => {
      if (onSave) onSave(data);

      backHistory();
    },
    [backHistory, onSave]
  );

  return <ModelCreateActionSave onSave={handleSave} {...props} />;
};

export const ModelCreateActionSaveAnother = ({
  children,
  onSave,
  ...props
}) => {
  const { reset } = useFormContext();

  const handleSave = useCallback(
    (data) => {
      if (onSave) onSave(data);

      reset();
    },
    [onSave, reset]
  );

  return (
    <ModelCreateActionSave onSave={handleSave} {...props}>
      {children || 'Save & Add Another'}
    </ModelCreateActionSave>
  );
};

export const ModelCreateActionCancel = ({ children, onCancel, ...props }) => {
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
  ModelCreateActionCancel,
  ModelCreateActionSave: ModelCreateActionSaveShow
};

export const ModelCreateActionsBase = ({
  overrides,
  actions,
  append = false,
  prepend = false,
  hasCancel,
  ...props
}) => {
  const { ModelCreateActionCancel, ModelCreateActionSave } = useOverrides(
    defaultComponents,
    overrides
  );

  const computedDefaultActions = useMemo(
    () =>
      [
        hasCancel && <ModelCreateActionCancel />,
        <ModelCreateActionSave />
      ].filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <ModelSection baseClassName="create-actions">
      <div
        className="d-flex flex-row flex-wrap justify-content-between mb-3"
        {...props}
      >
        {Children.map(computedActions, (action) => action)}
      </div>
    </ModelSection>
  );
};

ModelCreateActionsBase.propTypes = {
  hasCancel: PropTypes.bool.isRequired
};

ModelCreateActionsBase.defaultProps = {
  hasCancel: false
};

export const ModelCreateActions = (props) =>
  useGlobalComponentForModel(
    'ModelCreateActions',
    ModelCreateActionsBase,
    props
  );
