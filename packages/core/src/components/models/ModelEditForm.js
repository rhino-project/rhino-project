import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useModelEditContext } from 'rhino/hooks/controllers';
import ModelSection from './ModelSection';

export const ModelEditFormBase = (props) => {
  const { renderPaths } = useModelEditContext();

  return <ModelSection baseClassName="edit-form">{renderPaths}</ModelSection>;
};

ModelEditFormBase.propTypes = {};

const ModelEditForm = (props) => useGlobalComponent(ModelEditFormBase, props);

export default ModelEditForm;
