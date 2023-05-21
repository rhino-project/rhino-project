import { useModelCreateContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import ModelSection from './ModelSection';

export const ModelCreateFormBase = (props) => {
  const { renderPaths } = useModelCreateContext();

  return <ModelSection baseClassName="create-form">{renderPaths}</ModelSection>;
};

ModelCreateFormBase.propTypes = {};

const ModelCreateForm = (props) =>
  useGlobalComponent(ModelCreateFormBase, props);

export default ModelCreateForm;
