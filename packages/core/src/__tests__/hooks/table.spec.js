import { render } from '@testing-library/react';
import { useTableInheritedProps } from 'rhino/hooks/table';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import Table from 'rhino/components/table/Table';

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

  return <Table table={table} />;
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
