import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import { CREATE_MODAL } from 'config';
import routePaths from 'rhino/routes';
import { getParentModel, isBaseOwned } from 'rhino/utils/models';
import { useBaseOwnerId } from 'rhino/hooks/owner';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

import ModelActions from 'rhino/components/models/ModelActions';
import ModelIndexHeader from 'rhino/components/models/ModelIndexHeader';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import ModelCreateModal from 'rhino/components/models/ModelCreateModal';
import { useBaseOwnerNavigation } from 'rhino/hooks/history';
import withParams from 'rhino/routes/withParams';
import { useModelIndexContext } from 'rhino/hooks/controllers';
import ModelIndexBase from './ModelIndexBase';
import { ModelIndexTableBase } from './ModelIndexTable';

const ModelIndexActions = (props) => {
  const { model } = useModelIndexContext();
  const { actions, parent } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const baseOwnerId = useBaseOwnerId();
  const location = useLocation();
  const baseOwnerNavigation = useBaseOwnerNavigation();

  const parentId = useMemo(() => {
    if (parent) return parent.id;

    if (isBaseOwned(model) && baseOwnerId) return baseOwnerId;

    return null;
  }, [model, parent, baseOwnerId]);

  const parentModel = useMemo(() => getParentModel(model), [model]);

  const createPath = useMemo(
    () =>
      withParams(routePaths[model.name].create(), {
        back: location.pathname,
        // FIXME Need foreignKey type identifier
        [parentModel?.model]: parentId
      }),
    [location, model, parentModel, parentId]
  );

  const handleActionSuccess = useCallback(
    (action, props, data) => {
      // FIXME Need foreignKey type identifier
      const resourceId = data?.id;

      if (!resourceId) return;

      const showPath = routePaths[model.name].show(resourceId);
      baseOwnerNavigation.push(showPath);
    },
    [baseOwnerNavigation, model]
  );

  const handleModalClose = () => setModalOpen(false);

  const handleAction = useCallback(() => {
    if (CREATE_MODAL) {
      setModalOpen(true);
    } else {
      baseOwnerNavigation.push(createPath);
    }
  }, [baseOwnerNavigation, createPath]);

  const computedActions = useMemo(() => {
    if (actions) return actions;

    if (isBaseOwned(model) || parent?.can_current_user_edit) {
      return [
        {
          name: 'create',
          label: `Add ${model.readableName}`,
          color: 'primary',
          icon: 'plus',
          onAction: handleAction
        }
      ];
    }

    return [];
  }, [actions, model, parent, handleAction]);

  return (
    <ModelWrapper {...props} baseClassName="index-actions">
      <ModelActions {...props} actions={computedActions} />
      {CREATE_MODAL && (
        <ModelCreateModal
          {...props}
          resource={{ [parentModel.model]: parentId }}
          isOpen={modalOpen}
          onModalClose={handleModalClose}
          onActionSuccess={handleActionSuccess}
        />
      )}
    </ModelWrapper>
  );
};

ModelIndexActions.propTypes = {
  actions: PropTypes.array,
  parent: PropTypes.object
};

const defaultComponents = {
  ModelIndex: ModelIndexBase,
  ModelIndexHeader,
  ModelIndexActions,
  ModelIndexTable: ModelIndexTableBase
};

const ModelIndex = ({ overrides, baseFilter, ...props }) => {
  if (baseFilter)
    console.warn(
      'baseFilter is deprecated. Use filter/limit/offset/order/search instead'
    );

  const {
    ModelIndex,
    ModelIndexHeader,
    ModelIndexActions,
    ModelIndexTable
  } = useGlobalOverrides(defaultComponents, overrides, props);

  return (
    <ModelWrapper {...props} baseClassName="index">
      {/* Legacy support - must be after the new props to avoid being overwritten by
      undefined */}
      <ModelIndex {...props} {...baseFilter}>
        <ModelIndexHeader {...props} />
        <hr />
        <ModelIndexActions {...props} />
        <ModelIndexTable {...props} />
      </ModelIndex>
    </ModelWrapper>
  );
};

ModelIndex.propTypes = {
  baseFilter: PropTypes.object,
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object,
  parent: PropTypes.object
};

export default ModelIndex;
