import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import PropTypes from 'prop-types';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  useGlobalComponentForModel,
  useOverrides
} from 'rhino/hooks/overrides';

import { useBaseOwnerNavigation } from 'rhino/hooks/history';
import { useModelIndexContext } from 'rhino/hooks/controllers';
import { filter, isString } from 'lodash';
import { usePaths } from 'rhino/hooks/paths';
import Table from '../table/Table';
import ModelCell from './ModelCell';
import ModelHeader from './ModelHeader';
import ModelFooter from './ModelFooter';
import { getModelShowPath } from '../../utils/routes';
import ModelSection from './ModelSection';

const getViewablePaths = (model) =>
  filter(model.properties, (a) => {
    return (
      a.type !== 'identifier' &&
      a.name !== model.ownedBy &&
      a.type !== 'array' &&
      a.type !== 'jsonb' &&
      a.type !== 'text' &&
      // a.type !== 'reference' &&
      !a.name.endsWith('_attachment')
    );
  }).map((a) => a.name);

const defaultComponents = {
  ModelHeader,
  ModelCell,
  ModelFooter
};

const isDesc = (order) => order?.charAt(0) === '-';

const getSortableAttributes = (model) =>
  filter(
    model.properties,
    (a) =>
      a.type === 'string' ||
      a.type === 'datetime' ||
      a.type === 'float' ||
      a.type === 'integer'
  );

export const ModelIndexTableBase = ({ overrides, ...props }) => {
  const { ModelHeader, ModelCell, ModelFooter } = useOverrides(
    defaultComponents,
    overrides
  );

  const { model, order, resources, results, setOrder } = useModelIndexContext();
  const { baseRoute, paths, sortPaths } = props;
  const baseOwnerNavigation = useBaseOwnerNavigation();
  const [sorting, setSorting] = useState([]);

  const pathsOrDefault = useMemo(() => {
    if (props.overrides?.ModelTable?.props?.paths)
      console.warn('ModelTable pass legacy paths prop');

    return (
      paths ||
      // Legacy
      props.overrides?.ModelTable?.props?.paths ||
      getViewablePaths(model)
    );
  }, [paths, props.overrides?.ModelTable?.props?.paths, model]);

  const computedPaths = usePaths(pathsOrDefault, resources);

  const handleRowClick = useCallback(
    (row) =>
      baseOwnerNavigation.push(
        `${baseRoute}${getModelShowPath(model, row.original.id)}`
      ),
    [baseRoute, baseOwnerNavigation, model]
  );

  const sortable = useMemo(
    () => sortPaths || getSortableAttributes(model).map((a) => a.name),
    [sortPaths, model]
  );

  const columns = useMemo(
    () =>
      computedPaths.map((path, idx) => {
        if (isValidElement(path)) {
          const accessor =
            path.props?.accessor ||
            (isString(path.props?.path) ? path.props?.path : null);
          // FIXME: Any issue using idx as id?
          const id = path.props?.id || idx.toString();
          const header =
            path.props?.header ||
            (() => (
              <ModelHeader model={model} path={path?.props?.path || null} />
            ));
          const cell = (props) => cloneElement(path, { model, ...props });
          const footer =
            path.props?.footer ||
            (() => (
              <ModelFooter model={model} path={path?.props?.path || null} />
            ));

          if (accessor) {
            return columnHelper.accessor(accessor, {
              id,
              header,
              cell,
              footer,
              enableSorting: false
            });
          }

          return columnHelper.display({
            id,
            header,
            cell,
            footer,
            enableSorting: false
          });
        }

        // Path is a string
        const cell = (info) => (
          <ModelCell model={model} path={path} {...info} />
        );

        const header = (info) => (
          <ModelHeader model={model} path={path} {...info} />
        );
        const footer = (info) => (
          <ModelFooter model={model} path={path} {...info} />
        );

        return columnHelper.accessor(path, {
          id: path,
          header,
          cell,
          footer,
          enableSorting: sortable.includes(path),
          enableMultiSort: sortable.includes(path)
        });
      }),
    [computedPaths, model, sortable]
  );

  useEffect(() => {
    // The initial pass will set the sorting state from the order prop
    if (sorting.length === 0) {
      setSorting(
        order.split(',').map((order) => {
          const id = order.replace('-', '');
          return { id, desc: isDesc(order) };
        })
      );

      return;
    }

    // The sorting state has changed, update the order in the controller
    setOrder(
      sorting.map((order) => (order.desc ? '-' + order.id : order.id)).join(',')
    );
  }, [order, setOrder, sorting]);

  const table = useReactTable({
    data: results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableMultiSort: true,
    enableSortingRemoval: false,
    manualSorting: true,
    state: {
      sorting
    },
    onSortingChange: setSorting
  });

  return (
    <ModelSection baseClassName="index-table">
      <Table table={table} onRowClick={handleRowClick} {...props} />
    </ModelSection>
  );
};

ModelIndexTableBase.propTypes = {
  baseRoute: PropTypes.string.isRequired,
  overrides: PropTypes.object
};

ModelIndexTableBase.defaultProps = {
  baseRoute: ''
};

const columnHelper = createColumnHelper();

export const ModelIndexTable = (props) =>
  useGlobalComponentForModel('ModelIndexTable', ModelIndexTableBase, props);

export default ModelIndexTable;
