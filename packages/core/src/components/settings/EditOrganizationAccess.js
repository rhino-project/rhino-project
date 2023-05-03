import { useCallback, useState } from 'react';

import { useBaseOwnerId } from 'rhino/hooks/owner';
import { ModelIndexActions } from 'rhino/components/models/ModelIndex';
import { useModel } from 'rhino/hooks/models';
import ModelEditableCellReference from '../models/cells/ModelEditableCellReference';
import ModelIndexBase from '../models/ModelIndexBase';
import ModelIndexHeader from '../models/ModelIndexHeader';
import ModelIndexTable from '../models/ModelIndexTable';
import { IconButton } from '../buttons';
import { useModelIndexContext } from 'rhino/hooks/controllers';
import ModelCreateModal from '../models/ModelCreateModal';

const RemoveButton = (props) => {
  const {
    row: { original }
  } = props;
  const {
    delete: { mutate, isLoading }
  } = useModelIndexContext();

  const handleClick = useCallback(() => mutate(original.id), [
    original.id,
    mutate
  ]);

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

const EditOrganizationAccess = () => {
  const model = useModel('users_role');
  const baseOwnerId = useBaseOwnerId();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAction = useCallback(() => setModalOpen(true), [setModalOpen]);

  const handleModalClose = () => setModalOpen(false);

  return (
    <>
      <ModelIndexBase
        model={model}
        filter={{ organization: baseOwnerId }}
        order="user.email"
      >
        <ModelIndexHeader
          overrides={{
            ModelFilters: {
              props: {
                paths: ['role']
              }
            },
            ModelSort: {
              props: { paths: ['user.email', 'user.name'] }
            }
          }}
        />
        <hr />
        <ModelIndexActions
          model={model}
          actions={[
            {
              name: 'create',
              label: 'Invite User',
              color: 'primary',
              icon: 'plus',
              onAction: handleAction
            }
          ]}
        />
        <ModelIndexTable paths={cellPaths} onRowClick={null} />
      </ModelIndexBase>
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
