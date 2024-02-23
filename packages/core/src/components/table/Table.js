import { useCallback, useMemo } from 'react';
import { Table as BTable } from 'reactstrap';
import { flexRender } from '@tanstack/react-table';
import classnames from 'classnames';
import { Icon } from '../icons';

const TableSortIndicator = ({ column }) => {
  if (!column.getCanSort()) return null;

  const sortOrder = column.getIsSorted();
  const upIcon = sortOrder === 'asc' ? 'caret-up-fill' : 'caret-up';
  const downIcon = sortOrder === 'desc' ? 'caret-down-fill' : 'caret-down';

  return (
    <div className="d-flex flex-column ms-auto">
      <Icon icon={upIcon} height={12} width={12} />
      <Icon icon={downIcon} height={12} width={12} />
    </div>
  );
};

export const Table = ({ table, onRowClick }) => {
  const handleRowClick = useCallback(
    (row) => {
      if (onRowClick) onRowClick(row);
    },
    [onRowClick]
  );

  const rowClassName = useMemo(
    () => classnames({ 'table-row-clickable': onRowClick }),
    [onRowClick]
  );

  return (
    <BTable striped hover={!!onRowClick}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={classnames({
                  'table-header-clickable': header.column.getCanSort()
                })}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div className="d-flex flex-row gap-1">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  <TableSortIndicator column={header.column} />
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className={rowClassName}
            onClick={() => handleRowClick(row)}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </BTable>
  );
};
