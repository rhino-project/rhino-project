import { useMemo } from 'react';

export const useTableInheritedProps = (props) => {
  const {
    cell,
    column,
    getValue,
    model,
    path,
    renderValue,
    row,
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
      row,
      table
    };

    return {
      ...extractedProps,
      extractedProps,
      inheritedProps
    };
  }, [
    cell,
    column,
    getValue,
    model,
    path,
    renderValue,
    row,
    table,
    inheritedProps
  ]);

  return propReturns;
};
