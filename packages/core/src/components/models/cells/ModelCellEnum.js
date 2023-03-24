import { useMemo } from 'react';
import CellBadge from 'rhino/components/table/cells/CellBadge';
import { useModelFilterField } from 'rhino/hooks/form';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const COLOR_PALETTE = ['#0369a1', '#047857', '#6d28d9', '#a21caf', '#be123c'];

const defaultComponents = {
  ModelCellEnum: CellBadge
};

const ModelCellEnum = ({ overrides, model, path, ...props }) => {
  const { ModelCellEnum } = useGlobalOverrides(defaultComponents, overrides);
  const { attribute } = useModelFilterField(model, path);
  const { getValue } = props;

  const style = useMemo(() => {
    const idx = attribute?.enum?.findIndex((e) => e === getValue());
    const backgroundColor =
      idx >= 0 ? COLOR_PALETTE[idx % COLOR_PALETTE.length] : COLOR_PALETTE[0];

    return { backgroundColor };
  }, [attribute, getValue]);

  return <ModelCellEnum style={style} {...props}></ModelCellEnum>;
};

export default ModelCellEnum;
