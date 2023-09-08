import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { Button, IconButton } from 'rhino/components/buttons';

const ModelActions = (props) => {
  const { actions } = props;

  const actionInProgress = useMemo(
    () => actions.some((a) => a.loading),
    [actions]
  );

  return (
    <ModelWrapper {...props} baseClassName="actions">
      <div className="d-flex flex-row flex-wrap justify-content-between mb-3">
        {actions.map(({ name, label, disabled, onAction, ...action }) => {
          const BaseButton = action.icon ? IconButton : Button;

          return (
            <BaseButton
              key={name}
              color="secondary"
              {...action}
              disabled={actionInProgress || disabled}
              onClick={() => onAction(name, props)}
            >
              {label}
            </BaseButton>
          );
        })}
      </div>
    </ModelWrapper>
  );
};

ModelActions.propTypes = {
  model: PropTypes.object.isRequired,
  actions: PropTypes.array.isRequired
};

export default ModelActions;
