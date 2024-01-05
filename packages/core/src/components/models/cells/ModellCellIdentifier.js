import { useCallback, useMemo } from 'react';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import CellLink from 'rhino/components/table/cells/CellLink';
import { useModelShowPath } from 'rhino/hooks/routes';
import { useModelIndexContext } from 'rhino/hooks/controllers';

export const ModelCellIdentifierBase = ({ children, getValue, ...props }) => {
  const { model } = useModelIndexContext();
  const id = getValue();

  // FIXME Support related models
  const showPath = useModelShowPath(model, id);

  // If there is no id, we don't want to render a link
  const syntheticGetValue = useCallback(
    () => (id ? showPath : null),
    [id, showPath]
  );
  const linkText = useMemo(() => children || id, [children, id]);

  return (
    <CellLink getValue={syntheticGetValue} {...props}>
      {linkText}
    </CellLink>
  );
};

const ModelCellIdentifier = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellIdentifier',
    ModelCellIdentifierBase,
    props
  );

export default ModelCellIdentifier;
