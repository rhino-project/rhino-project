import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import ModelActions from 'rhino/components/models/ModelActions';
import ModelEditModal from 'rhino/components/models/ModelEditModal';
import { EDIT_MODAL } from 'config';
import withParams from 'rhino/routes/withParams';
import routePaths from 'rhino/routes';
import { getParentModel, isBaseOwned } from 'rhino/utils/models';
import { useModelDelete } from 'rhino/hooks/queries';
import { useBaseOwnerNavigation } from 'rhino/hooks/history';
import { useModelShowContext } from 'rhino/hooks/controllers';

const ModelShowActions = (props) => {
  const { model, resource } = useModelShowContext();
  const { actions } = props;
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

  const editPath = withParams(routePaths[model.name].edit(resource?.id), {
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
    <ModelWrapper model={model} {...props} baseClassName="show-actions">
      <ModelActions model={model} {...props} actions={computedActions} />
      {EDIT_MODAL && (
        <ModelEditModal
          model={model}
          modelId={resource.id}
          isOpen={modalOpen}
          onModalClose={handleModalClose}
        />
      )}
    </ModelWrapper>
  );
};

ModelShowActions.propTypes = {
  actions: PropTypes.array
};

export default ModelShowActions;
