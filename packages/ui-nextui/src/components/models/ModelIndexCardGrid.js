import PropTypes from 'prop-types';

import { ModelIndexTableBase } from './ModelIndexTable';
import { flexRender } from '@tanstack/react-table';
import {
  useGlobalComponentForModel,
  useOverrides
} from '@rhino-project/core/hooks';
import { Card, CardBody, CardHeader } from '@heroui/react';

export const ModelIndexCard = ({ row, onRowClick }) => {
  const titleCell = row.getVisibleCells()?.[0];
  const subtitleCell = row.getVisibleCells()?.[1];

  return (
    <Card
      key={row.id}
      className="w-80"
      isPressable
      onPress={() => onRowClick(row)}
    >
      <CardHeader>
        <div className="flex flex-col items-start">
          {titleCell && (
            <div className="text-lg">
              {flexRender(
                titleCell.column.columnDef.cell,
                titleCell.getContext()
              )}
            </div>
          )}
          {subtitleCell && (
            <div className="text-md">
              {flexRender(
                subtitleCell.column.columnDef.cell,
                subtitleCell.getContext()
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {row
          .getVisibleCells()
          .slice(2)
          .map((cell) => (
            <div key={cell.id} className="text-fg-300">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ))}
      </CardBody>
    </Card>
  );
};

const defaultComponents = {
  ModelIndexCard
};

const ModelIndexCardGridInternal = ({ overrides, table, onRowClick }) => {
  const { ModelIndexCard } = useOverrides(defaultComponents, overrides);

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {table.getRowModel().rows.map((row) => (
        <ModelIndexCard key={row.id} row={row} onRowClick={onRowClick} />
      ))}
    </div>
  );
};

const ModelIndexCardGridBase = ({ overrides, ...props }) => {
  return (
    <ModelIndexTableBase
      overrides={{
        ModelHeader: null,
        ModelFooter: null,
        // Passed through because its just an internal wrapper
        Table: { component: ModelIndexCardGridInternal, props: { overrides } }
      }}
      {...props}
    />
  );
};

ModelIndexCardGridBase.propTypes = {
  overrides: PropTypes.object,
  baseRoute: PropTypes.string,
  paths: PropTypes.oneOfType([PropTypes.array, PropTypes.func])
};

export const ModelIndexCardGrid = (props) =>
  useGlobalComponentForModel(
    'ModelIndexCardGrid',
    ModelIndexCardGridBase,
    props
  );
