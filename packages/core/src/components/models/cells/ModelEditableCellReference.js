import { useMemo } from 'react';
import { Input } from 'reactstrap';
import { useModelIndexContext } from '../../../hooks/controllers';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelIndex } from '../../../hooks/queries';
import { useTableInheritedProps } from '../../../hooks/table';
import { getModelFromRef } from '../../../utils/models';
import { useModelAndAttributeFromPath } from '../../../hooks/models';

export const ModelEditableCellReferenceBase = ({ model, ...props }) => {
  const {
    path,
    row,
    getValue,
    filter,
    limit = 100,
    offset,
    order,
    search
  } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);

  const { results, isInitialLoading } = useModelIndex(refModel, {
    search,
    filter,
    limit,
    offset,
    order
  });

  const {
    update: { mutate }
  } = useModelIndexContext();
  const { inheritedProps } = useTableInheritedProps(props);

  const options = useMemo(
    () =>
      results?.map((result) => (
        <option value={result.id}>{result.display_name}</option>
      )),
    [results]
  );

  return (
    <Input
      type="select"
      value={getValue()?.id || getValue() || ''}
      onChange={({ target: { value } }) =>
        mutate({ id: row.original.id, [path]: value })
      }
      disabled={isInitialLoading}
      {...inheritedProps}
    >
      {options}
    </Input>
  );
};

export const ModelEditableCellReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelEditableCellReference',
    ModelEditableCellReferenceBase,
    props
  );
