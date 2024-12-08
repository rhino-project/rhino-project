import { Input } from 'reactstrap';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { useModelIndexContext } from '@rhino-project/core/hooks';
import { useOverrides } from '@rhino-project/core/hooks';
import { useTableInheritedProps } from '@rhino-project/core/hooks';

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
