import { useMemo } from 'react';

export const useTableInheritedProps = (props, options = {}) => {
  const {
    cell,
    column,
    getValue,
    model,
    path,
    renderValue,
    table,
    ...inheritedProps
  } = props;

  const propReturns = useMemo(() => {
    const extractedProps = {
      cell,
      column,
      getValue,
      model,
      path,
      renderValue,
      table
    };

    return {
      ...extractedProps,
      extractedProps,
      inheritedProps
    };
  }, [cell, column, getValue, model, path, renderValue, table, inheritedProps]);

  return propReturns;
};
