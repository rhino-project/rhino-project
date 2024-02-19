import PropTypes from 'prop-types';
import { Children, useCallback, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useModelEditContext } from 'rhino/hooks/controllers';
import { useBackHistory } from '../../hooks/history';
import {
  useGlobalComponentForModel,
  useOverrides
} from '../../hooks/overrides';
import { IconButton } from '../buttons';
import ModelSection from './ModelSection';

export const ModelEditActionSave = ({ children, onSave, ...props }) => {
  const { mutate, isLoading } = useModelEditContext();
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

export const ModelEditActionSaveShow = ({ onSave, ...props }) => {
  const navigate = useNavigate();
  const handleSave = useCallback(
    (data) => {
      if (onSave) onSave(data);

      navigate('..');
    },
    [navigate, onSave]
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
    <ModelSection baseClassName="edit-actions">
      <div
        className="d-flex flex-row flex-wrap justify-content-between mb-3"
        {...props}
      >
        {Children.map(computedActions, (action) => action)}
      </div>
    </ModelSection>
  );
};

ModelEditActionsBase.propTypes = {
  hasCancel: PropTypes.bool.isRequired
};

ModelEditActionsBase.defaultProps = {
  hasCancel: false
};

const ModelEditActions = (props) =>
  useGlobalComponentForModel('ModelEditActions', ModelEditActionsBase, props);

export default ModelEditActions;
