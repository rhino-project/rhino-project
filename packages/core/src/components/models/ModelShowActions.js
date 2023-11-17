import { Children, useCallback, useMemo, useState } from 'react';

import { useNavigate } from 'react-router';
import { useModelShowContext } from 'rhino/hooks/controllers';
import { getModelShowPath } from 'rhino/utils/routes';
import { useBaseOwnerNavigation } from '../../hooks/history';
import {
  useGlobalComponentForModel,
  useOverrides
} from '../../hooks/overrides';
import withParams from '../../routes/withParams';
import { getParentModel, isBaseOwned } from '../../utils/models';
import { IconButton } from '../buttons';
import ModelEditModal from './ModelEditModal';
import ModelSection from './ModelSection';

export const ModelShowActionEdit = ({ children, ...props }) => {
  const navigate = useNavigate();

  const editPath = useMemo(
    () =>
      withParams('edit', {
        back: location.pathname
      }),
    []
  );

  const handleClick = useCallback(
    () => navigate(editPath),
    [navigate, editPath]
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

export const ModelShowActionEditModal = (props) => {
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
  const navigate = useNavigate();
  const baseOwnerNavigation = useBaseOwnerNavigation();

  const handleClick = useCallback(() => {
    if (confirm(`Do you want to delete ${resource.display_name}?`)) {
      mutate(resource.id, {
        onSuccess: () => {
          if (isBaseOwned(model)) {
            navigate('..');
          } else {
            const parentModel = getParentModel(model);
            const parent = resource[parentModel.model];
            baseOwnerNavigation.push(getModelShowPath(parentModel, parent.id));
          }
        }
      });
    }
  }, [resource, mutate, model, navigate, baseOwnerNavigation]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
