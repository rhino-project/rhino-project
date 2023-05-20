import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelCreateContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelCreateFormBase = (props) => {
  const { model, renderPaths } = useModelCreateContext();

  return (
    <ModelWrapper model={model} {...props} baseClassName="create-form">
      {renderPaths}
    </ModelWrapper>
  );
};

ModelCreateFormBase.propTypes = {};

const ModelCreateForm = (props) =>
  useGlobalComponent(ModelCreateFormBase, props);

export default ModelCreateForm;
