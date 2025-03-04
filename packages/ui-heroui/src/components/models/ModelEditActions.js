import PropTypes from 'prop-types';
import { Children, useCallback, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';
import { useModelEditContext } from '@rhino-project/core/hooks';
import {
  useGlobalComponentForModel,
  useOverrides
} from '@rhino-project/core/hooks';
import { IconButton } from '../buttons';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useBackHistory } from '../../hooks';

export const ModelEditActionSave = ({ children, onSave, ...props }) => {
  const { mutate, isPending } = useModelEditContext();
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

export const ModelEditActionSaveShow = ({ onSave, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSave = useCallback(
    (data) => {
      if (onSave) onSave(data);

      navigate({ from: location.pathname, to: '..' });
    },
    [location.pathname, navigate, onSave]
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
    <IconButton outline icon="bi:x-square" onPress={handleClick} {...props}>
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

  const computedDefaultActions = useMemo(
    () =>
      // eslint-disable-next-line react/jsx-key
      [hasCancel && <ModelEditActionCancel />, <ModelEditActionSave />].filter(
        Boolean
      ),
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
    <div className="flex flex-row flex-wrap justify-between" {...props}>
      {Children.map(computedActions, (action) => action)}
    </div>
  );
};

ModelEditActionsBase.propTypes = {
  hasCancel: PropTypes.bool.isRequired
};

ModelEditActionsBase.defaultProps = {
  hasCancel: false
};

export const ModelEditActions = (props) =>
  useGlobalComponentForModel('ModelEditActions', ModelEditActionsBase, props);
