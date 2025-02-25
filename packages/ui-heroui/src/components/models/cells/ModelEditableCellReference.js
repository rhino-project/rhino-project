import { useMemo } from 'react';
import { useModelIndexContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { useModelIndex } from '@rhino-project/core/hooks';
import { useTableInheritedProps } from '@rhino-project/core/hooks';
import { getModelFromRef } from '@rhino-project/core/utils';
import { useModelAndAttributeFromPath } from '@rhino-project/core/hooks';
import { Select, SelectItem } from '@heroui/react';
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

  const { results } = useModelIndex(refModel, {
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
        <SelectItem key={`${result.id}`}>{result.display_name}</SelectItem>
      )),
    [results]
  );

  return (
    <Select
      disallowEmptySelection
      selectedKeys={[`${getValue()?.id || getValue() || ''}`]}
      onChange={({ target }) => {
        mutate({ id: row.original.id, [path]: target.value });
      }}
      {...inheritedProps}
    >
      {options}
    </Select>
  );
};

export const ModelEditableCellReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelEditableCellReference',
    ModelEditableCellReferenceBase,
    props
  );
