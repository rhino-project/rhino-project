import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { useTable } from 'react-table';
import { filter } from 'lodash';
import classnames from 'classnames';

import { getAttributeFromPath } from 'rhino/utils/models';
import { useOverrides } from 'rhino/hooks/overrides';
import { getStringForDisplay } from 'rhino/utils/ui';
import { Icon } from 'rhino/components/icons';
import { usePaths } from 'rhino/hooks/paths';

export const ModelTableCellRenderer = ({ column: { attribute }, value }) =>
  getStringForDisplay(attribute, value);

export const ModelTableMemberActions = ({ memberActions, key, row }) => {
  return (
    <UncontrolledDropdown key={key}>
      <DropdownToggle tag={'div'}>
        <Icon icon="three-dots-vertical" height={24} width={24} />
      </DropdownToggle>
      <DropdownMenu>
        {memberActions.map((a) => (
          <DropdownItem
            key={a.name}
            onClick={() => a.onAction(a.name, row.original.id, row.index, row)}
          >
            {a.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

ModelTableMemberActions.propTypes = {
  memberActions: PropTypes.array.isRequired,
  row: PropTypes.object.isRequired
};

export const ModelTableHeader = ({ headerGroups, model }) => {
  return (
    <thead className={`model-table-header model-table-header-${model.model}`}>
      {headerGroups.map((headerGroup) => (
        // eslint-disable-next-line react/jsx-key
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            // eslint-disable-next-line react/jsx-key
            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
          ))}
        </tr>
      ))}
    </thead>
  );
};

ModelTableHeader.propTypes = {
  headerGroups: PropTypes.array.isRequired,
  model: PropTypes.object.isRequired
};

export const ModelTableRow = (props) => {
  const { model, row, onRowClick } = props;

  const handleRowClick = useCallback(
    (row) => {
      if (onRowClick) onRowClick(row);
    },
    [onRowClick]
  );

  return (
    <tr
      className={classnames(
        'model-table-row',
        `model-table-row-${model.model}`,
        { 'model-table-row-clickable': onRowClick }
      )}
      {...row.getRowProps()}
      onClick={() => handleRowClick(row)}
    >
      {row.cells.map((cell) => (
        // eslint-disable-next-line react/jsx-key
        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
      ))}
    </tr>
  );
};

ModelTableRow.propTypes = {
  model: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  onRowClick: PropTypes.func
};

const defaultBodyComponents = {
  ModelTableRow
};

export const ModelTableBody = (props) => {
  const { getTableBodyProps, model, overrides, prepareRow, rows } = props;

  const { ModelTableRow } = useOverrides(defaultBodyComponents, overrides);

  return (
    <tbody
      className={`model-table-body model-table-body-${model.model}`}
      {...getTableBodyProps()}
    >
      {rows.map((row) => {
        prepareRow(row);

        // eslint-disable-next-line react/jsx-key
        return <ModelTableRow key={row.original.id} {...props} row={row} />;
      })}
    </tbody>
  );
};

ModelTableBody.propTypes = {
  getTableBodyProps: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object,
  prepareRow: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired
};

const defaultComponents = {
  ModelTableHeader,
  ModelTableBody,
  ModelTableCellRenderer,
  ModelTableMemberActions
};

const getViewablePaths = (model) =>
  filter(model.properties, (a) => {
    return (
      a.type !== 'identifier' &&
      a.name !== model.ownedBy &&
      a.type !== 'array' &&
      a.type !== 'jsonb' &&
      a.type !== 'text' &&
      !a.name.endsWith('_attachment')
    );
  }).map((a) => (a.type === 'reference' ? `${a.name}.display_name` : a.name));

const ModelTable = (props) => {
  const { memberActions, loading, model, overrides, paths, resources } = props;
  const {
    ModelTableHeader,
    ModelTableBody,
    ModelTableCellRenderer,
    ModelTableMemberActions
  } = useOverrides(defaultComponents, overrides);

  const pathsOrDefault = useMemo(() => {
    return paths || getViewablePaths(model);
  }, [paths, model]);
  const computedPaths = usePaths(pathsOrDefault, resources);

  const columns = useMemo(() => {
    const computedColumns = computedPaths.map((p) => {
      const attribute = getAttributeFromPath(model, p);

      return {
        Header: attribute.readableName,
        accessor: p,
        Cell: ModelTableCellRenderer,
        attribute
      };
    });

    if (memberActions) {
      computedColumns.push({
        id: 'memberActions',
        Cell: ModelTableMemberActions
      });
    }

    return computedColumns;
  }, [
    memberActions,
    ModelTableMemberActions,
    computedPaths,
    model,
    ModelTableCellRenderer
  ]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns: columns,
      data: resources?.results || [],
      memberActions
    });

  if (loading) {
    return <Spinner className="mx-auto d-block" />;
  }

  // Based on https://react-table.tanstack.com/docs/examples/bootstrap-ui-components
  return (
    <div className={`model-table model-table-${model.model}`}>
      <Table width="100%" striped hover {...getTableProps()}>
        <ModelTableHeader {...props} headerGroups={headerGroups} />
        <ModelTableBody
          {...props}
          getTableBodyProps={getTableBodyProps}
          prepareRow={prepareRow}
          rows={rows}
        />
      </Table>
    </div>
  );
};

ModelTable.propTypes = {
  memberActions: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object,
  paths: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  resources: PropTypes.object,
  onRowClick: PropTypes.func
};

ModelTable.defaultProps = {
  baseRoute: '',
  loading: false
};

export default ModelTable;
