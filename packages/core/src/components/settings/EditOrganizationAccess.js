import { useCallback, useMemo, useState } from 'react';

import { useBaseOwnerId } from '../../hooks/owner';
import { useModel } from '../../hooks/models';
import { ModelEditableCellReference } from '../models/cells/ModelEditableCellReference';
import { ModelIndexHeader } from '../models/ModelIndexHeader';
import { ModelIndexTable } from '../models/ModelIndexTable';
import { IconButton } from '../buttons';
import { useModelIndexContext } from '../../hooks/controllers';
import { ModelCreateModal } from '../models/ModelCreateModal';
import {
  ModelIndexActions,
  ModelIndexActionCreate
} from '../models/ModelIndexActions';
import { ModelIndexSimple } from '../models/ModelIndexSimple';

const RemoveButton = (props) => {
  const {
    row: { original }
  } = props;
  const {
    delete: { mutate, isLoading }
  } = useModelIndexContext();

  const handleClick = useCallback(
    () => mutate(original.id),
    [original.id, mutate]
  );

  return (
    <IconButton
      color="danger"
      icon="trash"
      disabled={isLoading}
      onClick={handleClick}
    >
      Remove Access
    </IconButton>
  );
};

const cellPaths = [
  'user.email',
  'user.name',
  <ModelEditableCellReference id="role" path="role" />,
  <RemoveButton />
];

const sortPaths = ['user.email', 'user.name'];

const overrides = {
  ModelFilters: {
    props: {
      paths: ['role']
    }
  }
};

export const EditOrganizationAccess = () => {
  const model = useModel('users_role');
  const baseOwnerId = useBaseOwnerId();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAction = useCallback(() => setModalOpen(true), [setModalOpen]);
  const handleModalClose = () => setModalOpen(false);

  const actions = useMemo(() => {
    return [
      <ModelIndexActionCreate onClick={handleAction}>
        Invite User
      </ModelIndexActionCreate>
    ];
  }, [handleAction]);

  return (
    <>
      <ModelIndexSimple model={model} order="user.email">
        <ModelIndexHeader overrides={overrides} />
        <hr />
        <ModelIndexActions actions={actions} />
        <ModelIndexTable
          paths={cellPaths}
          sortPaths={sortPaths}
          onRowClick={null}
        />
      </ModelIndexSimple>
      <ModelCreateModal
        model="users_role_invite"
        parentId={baseOwnerId}
        isOpen={modalOpen}
        onModalClose={handleModalClose}
      />
    </>
  );
};
