import {
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
  useState
} from 'react';
import PropTypes from 'prop-types';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';

import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { getModelFromRef, getUpdatableAttributes } from 'rhino/utils/models';
import { useComputedPaths, useDefaultValues } from 'rhino/hooks/form';
import { IconButton } from 'rhino/components/buttons';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import { isString } from 'lodash';
import ModelHeader from '../ModelHeader';
import ModelFooter from '../ModelFooter';
import Table from 'rhino/components/table/Table';
import { Icon } from 'rhino/components/icons';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';
import { useFieldArray } from 'react-hook-form';
import ModelDisplay from '../ModelDisplay';
import FieldHidden from 'rhino/components/forms/fields/FieldHidden';
import { useTableInheritedProps } from 'rhino/hooks/table';
import ModelField from '../ModelField';
import FieldFeedback from 'rhino/components/forms/FieldFeedback';
import ModelSection from '../ModelSection';

const columnHelper = createColumnHelper();
const destroyFilter = (row) => row.original._destroy !== '1';

// Can't handle arrays when nested
const getNestedUpdatableAttributes = (model) =>
  getUpdatableAttributes(model).filter((a) => a.type !== 'array');

const ModelCellNestedDisplay = (props) => (
  <>
    <ModelDisplay {...props} />
    <FieldFeedback {...props} />
  </>
);

const ModelCellNestedEditable = (props) => (
  <>
    <ModelField {...props} />
    <FieldFeedback {...props} />
  </>
);

const ModelCellNested = ({ path, ...props }) => {
  const {
    table: {
      options: {
        meta: { arrayPath, model, editIndex }
      }
    },
    row: { index }
  } = props;

  // We strip out the table props because we don't want to pass them down to the ModelDisplay
  const { inheritedProps } = useTableInheritedProps(props);

  const nestedPath = `${arrayPath}.${index}.${path}`;
  if (editIndex === index) {
    return (
      <ModelCellNestedEditable
        {...inheritedProps}
        model={model}
        path={nestedPath}
      />
    );
  }

  return (
    <ModelCellNestedDisplay
      {...inheritedProps}
      model={model}
      path={nestedPath}
    />
  );
};

const ModelFieldNestedBase = ({ overrides, model, ...props }) => {
  const { path: arrayPath, paths } = props;
  const { attribute } = useModelAndAttributeFromPath(model, arrayPath);
  const refModel = getModelFromRef(attribute);

  const { fields, update, prepend } = useFieldArray({
    name: arrayPath,
    keyName: 'nestedId',
    // Keep the values that are unmounted/hidden
    shouldUnregister: false
  });

  const [editIndex, setEditIndex] = useState(false);
  const handleEdit = useCallback(
    ({ row: { index } }) => setEditIndex(index),
    []
  );

  const handleDelete = useCallback(
    ({
      row: { index },
      table: {
        options: {
          meta: { setEditIndex, editIndex }
        }
      }
    }) => {
      update(index, { ...fields[index], _destroy: '1' });
      // Reset edit index
      if (index === editIndex) setEditIndex(false);
    },
    [fields, update]
  );

  const computedPaths = useComputedPaths(
    refModel,
    paths,
    getNestedUpdatableAttributes
  );

  const defaultValues = useDefaultValues(refModel, computedPaths);

  const handleAdd = () => {
    prepend(defaultValues);
    setEditIndex(0);
  };

  const arrayOptions = attribute?.items?.['x-rhino-attribute-array'];

  const columns = useMemo(() => {
    const columnsWithActions = computedPaths.map((path, idx) => {
      if (isValidElement(path)) {
        const accessor =
          path.props?.accessor ||
          (isString(path.props?.path) ? path.props?.path : null);
        // FIXME: Any issue using idx as id?
        const id = path.props?.id || idx.toString();
        const header =
          path.props?.header ||
          (() => (
            <ModelHeader model={refModel} path={path?.props?.path || null} />
          ));
        const cell = (props) => cloneElement(path, { model, ...props });
        const footer =
          path.props?.footer ||
          (() => (
            <ModelFooter model={refModel} path={path?.props?.path || null} />
          ));

        if (accessor) {
          return columnHelper.accessor(accessor, {
            id,
            header,
            cell,
            footer
          });
        }

        return columnHelper.display({ id, header, cell, footer });
      }

      // Path is a string
      const cell = (info) => (
        <ModelCellNested model={model} path={path} {...info} />
      );

      const nestedPath = `${arrayPath}.${path}`;
      const header = (info) => (
        <ModelHeader model={model} path={nestedPath} {...info} />
      );
      const footer = (info) => (
        <ModelFooter model={model} path={nestedPath} {...info} />
      );

      return columnHelper.accessor(path, { id: path, header, cell, footer });
    });

    columnsWithActions.push(
      columnHelper.accessor('_destroy', {
        id: '_destroy',
        filterFn: destroyFilter,
        cell: (info) => {
          const {
            row: { index: idx }
          } = info;
          const nestedPath = `${arrayPath}.${idx}._destroy`;
          return <FieldHidden path={nestedPath} defaultValue={0} />;
        }
      })
    );

    if (arrayOptions?.updatable || arrayOptions?.destroyable) {
      columnsWithActions.push(
        columnHelper.display({
          id: 'actions',
          cell: (info) => {
            return (
              <UncontrolledDropdown>
                <DropdownToggle tag={'div'}>
                  <Icon icon="three-dots-vertical" height={24} width={24} />
                  <DropdownMenu>
                    {arrayOptions?.updatable && (
                      <DropdownItem onClick={() => handleEdit(info)}>
                        Edit
                      </DropdownItem>
                    )}
                    {arrayOptions?.destroyable && (
                      <DropdownItem onClick={() => handleDelete(info)}>
                        Delete
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </DropdownToggle>
              </UncontrolledDropdown>
            );
          }
        })
      );
    }

    return columnsWithActions;
  }, [
    arrayPath,
    computedPaths,
    refModel,
    model,
    arrayOptions?.destroyable,
    arrayOptions?.updatable,
    handleDelete,
    handleEdit
  ]);

  const table = useReactTable({
    data: fields,
    columns,
    // We hide the destroy column by default and filter out rows with _destroy
    initialState: {
      columnFilters: [{ id: '_destroy', value: '1' }],
      columnVisibility: { _destroy: false }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: { model, arrayPath, editIndex, setEditIndex }
  });

  return (
    <ModelSection baseClassName="nested">
      {arrayOptions?.creatable && (
        <IconButton icon="plus" outline onClick={handleAdd} />
      )}
      <Table table={table} />
    </ModelSection>
  );
};

ModelFieldNestedBase.propTypes = {
  overrides: PropTypes.object,
  paths: PropTypes.array,
  resources: PropTypes.array,
  onChange: PropTypes.func,
  errors: PropTypes.object
};

const defaultComponents = {
  ModelFieldNested: ModelFieldNestedBase
};

const ModelFieldNested = ({ overrides, ...props }) => {
  const { ModelFieldNested } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldNested {...props} />;
};

ModelFieldNested.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldNested;
