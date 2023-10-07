import { Children, useCallback, useMemo, useState } from 'react';

import { useModelShowContext } from 'rhino/hooks/controllers';
import { IconButton } from '../buttons';
import { useBaseOwnerNavigation } from '../../hooks/history';
import {
  useGlobalComponentForModel,
  useOverrides
} from '../../hooks/overrides';
import withParams from '../../routes/withParams';
import { getParentModel, isBaseOwned } from '../../utils/models';
import ModelEditModal from './ModelEditModal';
import {
  getModelEditPath,
  getModelIndexPath,
  getModelShowPath
} from 'rhino/utils/routes';
import ModelSection from './ModelSection';

export const ModelShowActionEdit = ({ children, ...props }) => {
  const { model, resource } = useModelShowContext();
  const baseOwnerNavigation = useBaseOwnerNavigation();

  const editPath = useMemo(
    () =>
      withParams(getModelEditPath(model, resource?.id), {
        back: location.pathname
      }),
    [model, resource]
  );

  const handleClick = useCallback(
    () => baseOwnerNavigation.push(editPath),
    [baseOwnerNavigation, editPath]
  );

  return (
    <IconButton
      color="primary"
      icon="pencil-square"
      onClick={handleClick}
      {...props}
    >
      {children || 'Edit'}
    </IconButton>
  );
};

export const ModelShowActionEditModal = ({ children, ...props }) => {
  const { model, resource } = useModelShowContext();
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => setModalOpen(false);
  const handleClick = useCallback(() => setModalOpen(true), [setModalOpen]);

  return (
    <>
      <ModelShowActionEdit onClick={handleClick} {...props} />
      <ModelEditModal
        model={model}
        modelId={resource.id}
        isOpen={modalOpen}
        onModalClose={handleModalClose}
      />
    </>
  );
};

export const ModelShowActionDelete = ({ children, ...props }) => {
  const {
    model,
    resource,
    delete: { mutate }
  } = useModelShowContext();
  const baseOwnerNavigation = useBaseOwnerNavigation();

  const handleClick = useCallback(() => {
    if (confirm(`Do you want to delete ${resource.display_name}?`)) {
      mutate(resource.id, {
        onSuccess: () => {
          if (isBaseOwned(model)) {
            baseOwnerNavigation.push(getModelIndexPath(model));
          } else {
            const parentModel = getParentModel(model);
            const parent = resource[parentModel.model];
            baseOwnerNavigation.push(getModelShowPath(parentModel, parent.id));
          }
        }
      });
    }
  }, [model, mutate, resource, baseOwnerNavigation]);

  return (
    <IconButton color="danger" icon="trash" onClick={handleClick} {...props}>
      {children || 'Delete'}
    </IconButton>
  );
};

const defaultComponents = {
  ModelShowActionDelete,
  ModelShowActionEdit
};

export const ModelShowActionsBase = ({
  overrides,
  children,
  actions,
  append = false,
  prepend = false,
  ...props
}) => {
  const { ModelShowActionDelete, ModelShowActionEdit } = useOverrides(
    defaultComponents,
    overrides
  );
  const { resource } = useModelShowContext();

  const computedDefaultActions = useMemo(
    () =>
      [
        resource?.can_current_user_edit && <ModelShowActionEdit />,
        resource?.can_current_user_destroy && <ModelShowActionDelete />
      ].filter(Boolean),
    [resource?.can_current_user_destroy, resource?.can_current_user_edit]
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
    <ModelSection baseClassName="show-actions">
      <div
        className="d-flex flex-row flex-wrap justify-content-between mb-3"
        {...props}
      >
        {Children.map(computedActions, (action) => action)}
      </div>
    </ModelSection>
  );
};

ModelShowActionsBase.propTypes = {};

const MODAL_EDIT_OVERRIDES = { ModelShowActionEdit: ModelShowActionEditModal };
export const ModelShowActionsModalEdit = (props) => (
  <ModelShowActionsBase overrides={MODAL_EDIT_OVERRIDES} {...props} />
);

const ModelShowActions = (props) =>
  useGlobalComponentForModel('ModelShowActions', ModelShowActionsBase, props);

export default ModelShowActions;
