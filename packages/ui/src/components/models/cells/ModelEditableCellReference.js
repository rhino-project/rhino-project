import { useMemo } from 'react';
import { Input } from 'reactstrap';
import { useModelIndexContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { useModelIndex } from '@rhino-project/core/hooks';
import { useTableInheritedProps } from '@rhino-project/core/hooks';
import { getModelFromRef } from '@rhino-project/core/utils';
import { useModelAndAttributeFromPath } from '@rhino-project/core/hooks';
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
        // eslint-disable-next-line react/jsx-key
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
