import { Children, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useModelCreateContext } from '@rhino-project/core/hooks';
import { useFormContext } from 'react-hook-form';
import { IconButton } from '../buttons';
import {
  useGlobalComponentForModel,
  useOverrides
} from '@rhino-project/core/hooks';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useBackHistory } from '../../hooks';

export const ModelCreateActionSave = ({ children, onSave, ...props }) => {
  const { isPending, mutate } = useModelCreateContext();
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
      icon="bi:save"
      isLoading={isPending}
      onPress={handleClick}
      {...props}
    >
      {children || 'Save'}
    </IconButton>
  );
};

export const ModelCreateActionSaveShow = ({ onSave, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSave = useCallback(
    (data) => {
      if (onSave) onSave(data);

      navigate({ from: location.pathname, to: `../${data.id}` });
    },
    [onSave, navigate, location.pathname]
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
    <IconButton outline icon="bi:x-square" onPress={handleClick} {...props}>
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
        // eslint-disable-next-line react/jsx-key
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
    <div className="flex flex-row flex-wrap justify-between mb-3" {...props}>
      {Children.map(computedActions, (action) => action)}
    </div>
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
