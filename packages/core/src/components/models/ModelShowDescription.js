import { useModelShowContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import ModelWrapper from './ModelWrapper';

export const ModelShowDescriptionBase = (props) => {
  const { model, renderPaths } = useModelShowContext();

  return (
    <ModelWrapper model={model} {...props} baseClassName="show-description">
      {renderPaths}
    </ModelWrapper>
  );
};

ModelShowDescriptionBase.propTypes = {};

const ModelShowDescription = (props) =>
  useGlobalComponent(ModelShowDescriptionBase, props);

export default ModelShowDescription;
