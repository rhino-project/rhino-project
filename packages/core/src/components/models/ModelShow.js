import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';

import { EDIT_MODAL } from 'config';
import routePaths from 'rhino/routes';
import { useOverridesWithGlobal } from 'rhino/hooks/overrides';
import { getParentModel, isBaseOwned } from 'rhino/utils/models';
import { breadcrumbFor } from 'rhino/utils/ui';
import ModelActions from 'rhino/components/models/ModelActions';
import ModelShowDescription from 'rhino/components/models/ModelShowDescription';
import ModelShowRelated from 'rhino/components/models/ModelShowRelated';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import ModelEditModal from 'rhino/components/models/ModelEditModal';
import { useBaseOwnerNavigation } from 'rhino/hooks/history';
import withParams from 'rhino/routes/withParams';
import { useModelDelete, useModelShow } from 'rhino/hooks/queries';

const ModelShowHeader = ({ model, resource }) => {
  return breadcrumbFor(model, resource, true);
};

const ModelShowActions = (props) => {
  const { actions, resource, model } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const baseOwnerNavigation = useBaseOwnerNavigation();

  const { mutate, isLoading } = useModelDelete(model);

  const handleDestroy = useCallback(() => {
    if (confirm(`Do you want to delete ${resource.display_name}?`)) {
      mutate(resource.id, {
        onSuccess: () => {
          if (isBaseOwned(model)) {
            baseOwnerNavigation.push(routePaths[model.name].index());
          } else {
            const parentModel = getParentModel(model);
            const parent = resource[parentModel.model];
            baseOwnerNavigation.push(
              routePaths[parentModel.name].show(parent.id)
            );
          }
        }
      });
    }
  }, [baseOwnerNavigation, model, mutate, resource]);

  const editPath = withParams(routePaths[model.name].edit(resource.id), {
    back: location.pathname
  });

  const handleModalClose = () => setModalOpen(false);

  const handleAction = useCallback(() => {
    if (EDIT_MODAL) {
      setModalOpen(true);
    } else {
      baseOwnerNavigation.push(editPath);
    }
  }, [editPath, baseOwnerNavigation]);

  const computedActions = useMemo(() => {
    if (actions) return actions;

    const defaultActions = [];

    if (resource?.can_current_user_edit) {
      defaultActions.push({
        name: 'edit',
        label: 'Edit',
        color: 'primary',
        icon: 'pencil-square',
        onAction: handleAction
      });
    }

    if (resource?.can_current_user_destroy) {
      defaultActions.push({
        name: 'destroy',
        label: 'Delete',
        color: 'danger',
        icon: 'trash',
        loading: isLoading,
        onAction: handleDestroy
      });
    }

    return defaultActions;
  }, [actions, handleAction, handleDestroy, isLoading, resource]);

  return (
    <ModelWrapper {...props} baseClassName="show-actions">
      <ModelActions {...props} actions={computedActions} />
      {EDIT_MODAL && (
        <ModelEditModal
          {...props}
          modelId={resource.id}
          isOpen={modalOpen}
          onModalClose={handleModalClose}
        />
      )}
    </ModelWrapper>
  );
};

ModelShowActions.propTypes = {
  actions: PropTypes.array,
  model: PropTypes.object.isRequired,
  resource: PropTypes.object
};

const defaultComponents = {
  ModelShowHeader,
  ModelShowActions,
  ModelShowDescription,
  ModelShowRelated
};

const ModelShow = ({ overrides, ...props }) => {
  const { model, modelId } = props;
  const {
    ModelShowHeader,
    ModelShowActions,
    ModelShowDescription,
    ModelShowRelated
  } = useOverridesWithGlobal(model, 'show', defaultComponents, overrides);

  const { isLoading, resource } = useModelShow(model, modelId);

  if (isLoading) {
    return <Spinner className="mx-auto d-block" />;
  }

  return (
    <ModelWrapper {...props} baseClassName="show">
      <ModelShowHeader {...props} resource={resource} />
      <ModelShowActions {...props} resource={resource} />
      <ModelShowDescription {...props} resource={resource} />
      <ModelShowRelated {...props} resource={resource} />
    </ModelWrapper>
  );
};

ModelShow.propTypes = {
  model: PropTypes.object.isRequired,
  modelId: PropTypes.string.isRequired,
  overrides: PropTypes.object
};

export default ModelShow;
