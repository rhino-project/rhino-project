import { Input } from 'reactstrap';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelIndexContext } from '../../../hooks/controllers';
import { useOverrides } from '../../../hooks/overrides';
import { useTableInheritedProps } from '../../../hooks/table';

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

export const ModelEditableCellBoolean = (props) =>
  useGlobalComponentForAttribute(
    'ModelEditableCellBoolean',
    ModelEditableCellBooleanBase,
    props
  );
