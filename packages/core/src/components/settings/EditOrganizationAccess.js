import { useCallback, useMemo, useState } from 'react';

import { useBaseOwnerId } from 'rhino/hooks/owner';
import { useModel } from 'rhino/hooks/models';
import ModelEditableCellReference from '../models/cells/ModelEditableCellReference';
import ModelIndexHeader from '../models/ModelIndexHeader';
import ModelIndexTable from '../models/ModelIndexTable';
import { IconButton } from '../buttons';
import {
  useModelIndexContext,
  useModelIndexController
} from 'rhino/hooks/controllers';
import ModelCreateModal from '../models/ModelCreateModal';
import ModelIndexActions, {
  ModelIndexActionCreate
} from '../models/ModelIndexActions';
import ModelIndexProvider from '../models/ModelIndexProvider';

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

const overrides = {
  ModelFilters: {
    props: {
      paths: ['role']
    }
  },
  ModelSort: {
    props: { paths: ['user.email', 'user.name'] }
  }
};

const EditOrganizationAccess = () => {
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

  const controller = useModelIndexController({
    model,
    filter: { organization: baseOwnerId },
    order: 'user.email'
  });

  return (
    <>
      <ModelIndexProvider {...controller}>
        <ModelIndexHeader overrides={overrides} />
        <hr />
        <ModelIndexActions actions={actions} />
        <ModelIndexTable paths={cellPaths} onRowClick={null} />
      </ModelIndexProvider>
      <ModelCreateModal
        model="users_role_invite"
        parentId={baseOwnerId}
        isOpen={modalOpen}
        onModalClose={handleModalClose}
      />
    </>
  );
};

export default EditOrganizationAccess;
