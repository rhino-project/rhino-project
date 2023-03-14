import { useBaseOwnerId } from 'rhino/hooks/owner';
import ModelIndex from 'rhino/components/models/ModelIndex';
import { useModelDelete } from 'rhino/hooks/queries';
import { useModel } from 'rhino/hooks/models';
import { ModelTableCellRenderer } from 'rhino/components/models/ModelTable';
import ModelFormField from 'rhino/components/models/ModelFormField';
import { useCallback, useMemo, useState } from 'react';
import { useModelOptimisticUpdate } from 'rhino/hooks/queries';
import { FormFeedback } from 'reactstrap';
import { useBaseOwnerNavigation } from 'rhino/hooks/history';
import routePaths from 'rhino/routes';
import withParams from 'rhino/routes/withParams';
import { useLocation } from 'react-router-dom';
import { getParentModel } from 'rhino/utils/models';

const OrganizationAccessCell = (props) => {
  const {
    editIndex,
    editValue,
    originalValue,
    onChange,
    errors,
    errorsOnDelete,
    action,
    column: { attribute },
    row
  } = props;
  const { name } = attribute;

  if (row.index === editIndex && name === 'role' && action === 'edit')
    return (
      <>
        <ModelFormField
          attribute={attribute}
          path={name}
          resource={errors ? { [name]: originalValue } : { [name]: editValue }}
          onChange={onChange}
          errors={errors}
        />
        <FormFeedback>{errors?.role[0]}</FormFeedback>
      </>
    );

  if (row.index === editIndex && name === 'role' && action === 'destroy')
    return (
      <>
        <ModelFormField
          attribute={attribute}
          path={name}
          resource={{ [name]: editValue }}
          onChange={onChange}
          errors={errorsOnDelete}
        />
        <FormFeedback>{errorsOnDelete?.role[0]}</FormFeedback>
      </>
    );

  return <ModelTableCellRenderer {...props} />;
};

const EditOrganizationAccess = () => {
  const model = useModel('users_role');
  const baseOwnerId = useBaseOwnerId();
  const [editIndex, setEditIndex] = useState(false);
  const [editValue, setEditValue] = useState(null);
  const [editId, setEditId] = useState(null);
  const [originalValue, setOriginalValue] = useState(null);
  const [action, setAction] = useState(null);

  const {
    mutate: resourceDelete,
    error: errorOnDelete,
    reset: resetDelete
  } = useModelDelete(model);

  const {
    mutate: resourceUpdate,
    error: errorOnUpdate,
    reset
  } = useModelOptimisticUpdate(model);

  const handleEdit = (action, id, idx, row) => {
    reset();
    resetDelete();
    setAction(action);
    if (idx !== editIndex) {
      setEditIndex(row.index);
      setEditValue(row.original.role || null);
      setEditId(id);
      setOriginalValue(row.original.role || null);
    }
  };

  const handleDestroy = (action, id, _idx, row) => {
    setAction(action);
    setEditIndex(row.index);
    setEditValue(row.original.role || null);
    setEditId(id);
    resourceDelete(id);
  };

  const handleEditChange = useCallback(
    ({ role }) => {
      setEditValue(role);
      if (role !== null && role !== editValue) {
        resourceUpdate({ id: editId, role });
      }
    },
    [resourceUpdate, editId, editValue]
  );

  const inviteModel = useModel('users_role_invite');
  const location = useLocation();
  const baseOwnerNavigation = useBaseOwnerNavigation();
  const parentId = useMemo(() => baseOwnerId, [baseOwnerId]);
  const parentModel = useMemo(() => getParentModel(inviteModel), [inviteModel]);
  const createPath = useMemo(
    () =>
      withParams(routePaths[inviteModel.name].create(), {
        back: location.pathname,
        [parentModel?.model]: parentId
      }),
    [location, inviteModel, parentModel, parentId]
  );

  const handleAction = useCallback(() => {
    baseOwnerNavigation.push(createPath);
  }, [baseOwnerNavigation, createPath]);

  return (
    <>
      <ModelIndex
        filter={{ organization: baseOwnerId }}
        order="user.email"
        model={model}
        overrides={{
          ModelIndexHeader: {
            ModelFilters: {
              props: {
                paths: ['role']
              }
            },
            ModelSort: {
              props: { paths: ['user.email', 'user.name'] }
            }
          },
          ModelIndexActions: {
            props: {
              actions: [
                {
                  name: 'create',
                  label: 'Invite User',
                  color: 'primary',
                  icon: 'plus',
                  onAction: handleAction
                }
              ]
            }
          },
          ModelIndexTable: {
            ModelTable: {
              ModelTableCellRenderer: {
                component: OrganizationAccessCell,
                props: {
                  editIndex,
                  editValue,
                  originalValue,
                  onChange: handleEditChange,
                  errors: errorOnUpdate?.errors,
                  errorsOnDelete: errorOnDelete?.errors,
                  action: action
                }
              }
            },
            props: {
              memberActions: [
                { name: 'edit', label: 'Change Access', onAction: handleEdit },
                {
                  name: 'destroy',
                  label: 'Remove from Organization',
                  onAction: handleDestroy
                }
              ],
              onRowClick: null,
              paths: ['user.email', 'user.name', 'role']
            }
          }
        }}
      />
    </>
  );
};

export default EditOrganizationAccess;
