import { useCallback, useMemo } from 'react';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { CellLink } from '../../table/cells/CellLink';
import { useModelShowPath } from '../../../hooks/routes';
import { useModelIndexContext } from '../../../hooks/controllers';
import { useBaseOwnerPath } from '../../../hooks';

export const ModelCellIdentifierBase = ({ children, getValue, ...props }) => {
  const { model } = useModelIndexContext();
  const id = getValue();

  const showPath = useModelShowPath(model, id);
  const { build } = useBaseOwnerPath();

  // If there is no id, we don't want to render a link
  const syntheticGetValue = useCallback(
    () => (id ? build(showPath) : null),
    [build, id, showPath]
  );
  const linkText = useMemo(() => children || id, [children, id]);

  return (
    <CellLink getValue={syntheticGetValue} {...props}>
      {linkText}
    </CellLink>
  );
};

export const ModelCellIdentifier = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellIdentifier',
    ModelCellIdentifierBase,
    props
  );
