import {
  Table as NTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@heroui/react';
import { flexRender } from '@tanstack/react-table';
import { Icon } from '@iconify/react';

const TableSortIndicator = ({ column }) => {
  if (!column.getCanSort()) return null;

  const sortOrder = column.getIsSorted();
  const upIcon = sortOrder === 'asc' ? 'bi:caret-up-fill' : 'bi:caret-up';
  const downIcon =
    sortOrder === 'desc' ? 'bi:caret-down-fill' : 'bi:caret-down';

  return (
    <div className="flex flex-col ml-auto">
      <Icon className="size-3" icon={upIcon} />
      <Icon className="size-3" icon={downIcon} />
    </div>
  );
};

export const Table = ({ table }) => {
  return (
    <NTable
      aria-label="Table"
      isStriped
      // sortDescriptor={null}
      // onSortChange={(sort) => console.log('sort', sort)}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <TableHeader key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableColumn
              key={header.id}
              allowsSorting
              onClick={header.column.getToggleSortingHandler()}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              <TableSortIndicator column={header.column} />
            </TableColumn>
          ))}
        </TableHeader>
      ))}
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            className="cursor-pointer"
            {...table.options?.meta?.getRowProps(row)}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </NTable>
  );
};
