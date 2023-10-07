import { Input } from 'reactstrap';
import { useModelIndexContext } from 'rhino/hooks/controllers';
import {
  useGlobalComponentForAttribute,
  useOverrides
} from 'rhino/hooks/overrides';
import { useTableInheritedProps } from 'rhino/hooks/table';

const defaultComponents = {
  ModelEditableCellBoolean: Input
};

export const ModelEditableCellBooleanBase = ({
  overrides,
  getValue,
  row,
  ...props
}) => {
  const { ModelEditableCellBoolean } = useOverrides(
    defaultComponents,
    overrides
  );
  const {
    update: { mutate }
  } = useModelIndexContext();
  const { inheritedProps } = useTableInheritedProps(props);

  return (
    <ModelEditableCellBoolean
      type="checkbox"
      checked={getValue()}
      onClick={(e) => e.stopPropagation()}
      onChange={() =>
        mutate({ id: row.original.id, [props.path]: !getValue() })
      }
      {...inheritedProps}
    />
  );
};

export default ModelEditableCellBoolean;
