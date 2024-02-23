import PropTypes from 'prop-types';
import { Card, CardText, CardTitle, CardSubtitle } from 'reactstrap';
import classnames from 'classnames';

import { ModelIndexTableBase } from './ModelIndexTable';
import { flexRender } from '@tanstack/react-table';
import {
  useGlobalComponentForModel,
  useOverrides
} from '../../hooks/overrides';

export const ModelIndexCard = ({ row, onRowClick }) => {
  const titleCell = row.getVisibleCells()?.[0];
  const subtitleCell = row.getVisibleCells()?.[1];

  return (
    <Card
      key={row.id}
      style={{ width: '320px' }}
      className={classnames('model-card', 'p-2')}
      onClick={() => onRowClick(row)}
    >
      {titleCell && (
        <CardTitle tag="h5">
          {flexRender(titleCell.column.columnDef.cell, titleCell.getContext())}
        </CardTitle>
      )}
      {subtitleCell && (
        <CardSubtitle tag="h6" className="mb-2 text-secondary">
          {flexRender(
            subtitleCell.column.columnDef.cell,
            subtitleCell.getContext()
          )}
        </CardSubtitle>
      )}
      <CardText>
        {row
          .getVisibleCells()
          .slice(2)
          .map((cell) => (
            <div key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ))}
      </CardText>
    </Card>
  );
};

const defaultComponents = {
  ModelIndexCard
};

const ModelIndexCardGridInternal = ({ overrides, table, onRowClick }) => {
  const { ModelIndexCard } = useOverrides(defaultComponents, overrides);

  return (
    <div className="d-flex flex-row flex-wrap gap-2">
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
