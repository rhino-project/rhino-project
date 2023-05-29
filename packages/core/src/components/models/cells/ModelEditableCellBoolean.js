import { Input } from 'reactstrap';
import { useModelIndexContext } from 'rhino/hooks/controllers';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useTableInheritedProps } from 'rhino/hooks/table';

const defaultComponents = {
  ModelEditableCellBoolean: Input
};

const ModelEditableCellBoolean = ({ overrides, getValue, row, ...props }) => {
  const { ModelEditableCellBoolean } = useGlobalOverrides(
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
