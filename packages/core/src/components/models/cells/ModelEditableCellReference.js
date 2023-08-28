import { useMemo } from 'react';
import { Input } from 'reactstrap';
import { useModelIndexContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useModelIndex } from 'rhino/hooks/queries';
import { useTableInheritedProps } from 'rhino/hooks/table';
import { getModelFromRef } from 'rhino/utils/models';
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

const ModelEditableCellReference = (props) =>
  useGlobalComponent(
    'ModelEditableCellReference',
    ModelEditableCellReferenceBase,
    props
  );

export default ModelEditableCellReference;
