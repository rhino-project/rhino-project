import { useMemo } from 'react';
import { useModelAndAttributeFromPath } from '../../../hooks/models';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellBadge from '../../table/cells/CellBadge';

const COLOR_PALETTE = ['#0369a1', '#047857', '#6d28d9', '#a21caf', '#be123c'];

export const ModelCellEnumBase = (props) => {
  const { getValue, model, path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  const style = useMemo(() => {
    if (!getValue()) return {};

    const idx = attribute?.enum?.findIndex((e) => e === getValue());
    const backgroundColor =
      idx >= 0 ? COLOR_PALETTE[idx % COLOR_PALETTE.length] : COLOR_PALETTE[0];

    return { backgroundColor };
  }, [attribute, getValue]);

  return <CellBadge style={style} color="none" {...props} />;
};

const ModelCellEnum = (props) =>
  useGlobalComponentForAttribute('ModelCellEnum', ModelCellEnumBase, props);

export default ModelCellEnum;
