import { useGlobalComponent } from 'rhino/hooks/overrides';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelEditContext } from 'rhino/hooks/controllers';

export const ModelEditFormBase = (props) => {
  const { model, renderPaths } = useModelEditContext();

  return (
    <ModelWrapper model={model} {...props} baseClassName="edit-form">
      {renderPaths}
    </ModelWrapper>
  );
};

ModelEditFormBase.propTypes = {};

const ModelEditForm = (props) => useGlobalComponent(ModelEditFormBase, props);

export default ModelEditForm;
