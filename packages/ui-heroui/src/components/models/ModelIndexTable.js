import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import PropTypes from 'prop-types';
import {
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  useGlobalComponentForModel,
  usePaths
} from '@rhino-project/core/hooks';

import { filter, isString } from 'lodash-es';
import { useModelIndexContext } from '@rhino-project/core/hooks';
import { isIdentifier } from '@rhino-project/core/utils';
import { Table } from '../table/Table';
import { ModelCell } from './ModelCell';
import { ModelFooter } from './ModelFooter';
import { ModelHeader } from './ModelHeader';
import { useLocation, useNavigate } from '@tanstack/react-router';

const getViewablePaths = (model) =>
  filter(model.properties, (a) => {
    return (
      !isIdentifier(a) &&
      a.name !== model.ownedBy &&
      a.type !== 'array' &&
      a.type !== 'jsonb' &&
      a.type !== 'text' &&
      // a.type !== 'reference' &&
      !a.name.endsWith('_attachment')
    );
  }).map((a) => a.name);

const isDesc = (order) => order?.charAt(0) === '-';

const getSortableAttributes = (model) =>
  filter(
    model.properties,
    (a) =>
      a.type === 'string' ||
      a.type === 'datetime' ||
      a.type === 'number' ||
      a.type === 'integer'
  );

export const ModelIndexTableBase = (props) => {
  const { isLoading, limit, model, order, resources, results, setOrder } =
    useModelIndexContext();
  const { paths, sortPaths } = props;
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
          const id = path.props?.id || path.props?.path || idx.toString();
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
              enableSorting: sortable.includes(id),
              enableMultiSort: sortable.includes(id)
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
        const cell = (info) =>
          isLoading ? (
            <div className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </div>
          ) : (
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

    [computedPaths, isLoading, model, sortable]
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

  const data = useMemo(() => {
    return results || Array(limit).fill({});
  }, [limit, results]);

  const location = useLocation();
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableMultiSort: true,
    enableSortingRemoval: false,
    manualSorting: true,
    meta: {
      getRowProps: (row) => {
        const recordId = row?.original?.id;
        const target = recordId
          ? `${location.pathname}/${recordId}`
          : undefined;
        return {
          onClick: target ? () => navigate({ to: target }) : undefined,
          onKeyDown: target
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate({ to: target });
                }
              }
            : undefined,
          role: 'row',
          tabIndex: 0,
          'data-row-link': target
        };
      }
    },
    state: {
      sorting
    },
    onSortingChange: setSorting
  });

  return <Table table={table} {...props} />;
};

ModelIndexTableBase.propTypes = {
  overrides: PropTypes.object
};

const columnHelper = createColumnHelper();

export const ModelIndexTable = (props) =>
  useGlobalComponentForModel('ModelIndexTable', ModelIndexTableBase, props);
