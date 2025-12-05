import { render } from '@testing-library/react';
import { useTableInheritedProps } from '../../hooks/table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const DummyCell = (props) => {
  const { inheritedProps } = useTableInheritedProps(props);

  return <div {...inheritedProps} />;
};

const DummyTable = ({ cell }) => {
  const columns = [
    columnHelper.display({
      id: 'foo',
      cell
    })
  ];

  const table = useReactTable({
    data: [{ foo: 'bar' }],
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div className="d-flex flex-row gap-1">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
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
    </table>
  );
};

describe('useTableInheritedProps', () => {
  it('removes all react-table based props', () => {
    const { asFragment } = render(
      <DummyTable cell={(info) => <DummyCell {...info} />} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('passes non react-table based props', () => {
    const { asFragment } = render(
      <DummyTable cell={(info) => <DummyCell className="dummy" {...info} />} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
