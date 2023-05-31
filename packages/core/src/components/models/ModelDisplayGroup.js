import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';
import DisplayGroup from '../forms/DisplayGroup';
import ModelDisplayLabel from './ModelDisplayLabel';
import ModelDisplay from './ModelDisplay';
import ModelDisplayLayout from './ModelDisplayLayout';
import { useMemo } from 'react';

const defaultComponents = {
  ModelDisplayLayout,
  ModelDisplayLabel,
  ModelDisplay
};

export const ModelDisplayGroupBase = ({ overrides, ...props }) => {
  const { ModelDisplayLayout, ModelDisplayLabel, ModelDisplay } = useOverrides(
    defaultComponents,
    overrides
  );
  const combinedOverrides = useMemo(() => {
    return {
      DisplayLayout: {
        component: ModelDisplayLayout,
        DisplayLabel: ModelDisplayLabel,
        Display: ModelDisplay
      }
    };
  }, [ModelDisplay, ModelDisplayLabel, ModelDisplayLayout]);

  return <DisplayGroup overrides={combinedOverrides} {...props} />;
};

const ModelDisplayGroup = (props) =>
  useGlobalComponent('ModelDisplayGroup', ModelDisplayGroupBase, props);

export default ModelDisplayGroup;
