import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useModelEditContext } from 'rhino/hooks/controllers';
import ModelSection from './ModelSection';
import ModelFieldGroup from './ModelFieldGroup';
import { useRenderPaths } from 'rhino/hooks/paths';

export const ModelEditFormBase = (props) => {
  const { model, paths } = useModelEditContext();
  const renderPaths = useRenderPaths(paths, {
    Component: ModelFieldGroup,
    props: { model }
  });

  return <ModelSection baseClassName="edit-form">{renderPaths}</ModelSection>;
};

ModelEditFormBase.propTypes = {};

const ModelEditForm = (props) =>
  useGlobalComponent('ModelEditForm', ModelEditFormBase, props);

export default ModelEditForm;
