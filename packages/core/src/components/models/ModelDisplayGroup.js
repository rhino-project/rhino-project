import {
  useGlobalComponentForModel,
  useOverrides
} from 'rhino/hooks/overrides';
import DisplayGroup from '../forms/DisplayGroup';
import ModelDisplayLabel from './ModelDisplayLabel';
import ModelDisplay from './ModelDisplay';
import ModelDisplayLayout from './ModelDisplayLayout';
import { useMemo } from 'react';
import { useModelContext } from 'rhino/hooks/models';

const defaultComponents = {
  ModelDisplayLayout,
  ModelDisplayLabel,
  ModelDisplay
};

export const ModelDisplayGroupBase = ({ overrides, ...props }) => {
  const { model } = useModelContext();
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

  return (
    <DisplayGroup overrides={combinedOverrides} model={model} {...props} />
  );
};

const ModelDisplayGroup = (props) =>
  useGlobalComponentForModel('ModelDisplayGroup', ModelDisplayGroupBase, props);

export default ModelDisplayGroup;
