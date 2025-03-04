import { Children, useCallback, useMemo, useState } from 'react';

import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useModelShowContext } from '@rhino-project/core/hooks';
import { getModelShowPath } from '@rhino-project/core/utils';
import {
  useGlobalComponentForModel,
  useOverrides
} from '@rhino-project/core/hooks';
import { getParentModel, isBaseOwned } from '@rhino-project/core/utils';
import { IconButton } from '../buttons';
import { ModelEditModal } from './ModelEditModal';
import { useBaseOwnerNavigation } from '../../hooks';

export const ModelShowActionEdit = ({ children, ...props }) => {
  const location = useLocation();

  return (
    <IconButton
      as={Link}
      color="primary"
      icon="bi:pencil-square"
      to={`${location.href}/edit`}
      search={{ back: location.pathname }}
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
  const location = useLocation();
  const baseOwnerNavigation = useBaseOwnerNavigation();

  const handleClick = useCallback(() => {
    if (confirm(`Do you want to delete ${resource.display_name}?`)) {
      mutate(resource.id, {
        onSuccess: () => {
          if (isBaseOwned(model)) {
            navigate({ from: location.pathname, to: '..' });
          } else {
            const parentModel = getParentModel(model);
            const parent = resource[parentModel.model];
            baseOwnerNavigation.push(getModelShowPath(parentModel, parent.id));
          }
        }
      });
    }
  }, [
    resource,
    mutate,
    model,
    navigate,
    location.pathname,
    baseOwnerNavigation
  ]);

  return (
    <IconButton color="danger" icon="bi:trash" onClick={handleClick} {...props}>
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
    <div className="flex flex-row flex-wrap justify-between mb-3" {...props}>
      {Children.map(computedActions, (action) => action)}
    </div>
  );
};

ModelShowActionsBase.propTypes = {};

const MODAL_EDIT_OVERRIDES = { ModelShowActionEdit: ModelShowActionEditModal };
export const ModelShowActionsModalEdit = (props) => (
  <ModelShowActionsBase overrides={MODAL_EDIT_OVERRIDES} {...props} />
);

export const ModelShowActions = (props) =>
  useGlobalComponentForModel('ModelShowActions', ModelShowActionsBase, props);
