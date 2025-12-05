import { useCallback, useMemo } from 'react';
import {
  useGlobalComponentForAttribute,
  useModelShowPath
} from '@rhino-project/core/hooks';
import { CellLink } from '../../table/cells/CellLink';
import { useModelIndexContext } from '@rhino-project/core/hooks';
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
