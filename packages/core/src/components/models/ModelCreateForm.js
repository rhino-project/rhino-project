import { useModelCreateContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import ModelSection from './ModelSection';
import ModelFieldGroup from './ModelFieldGroup';
import { useRenderPaths } from 'rhino/hooks/paths';

export const ModelCreateFormBase = (props) => {
  const { model, paths } = useModelCreateContext();
  const renderPaths = useRenderPaths(paths, {
    Component: ModelFieldGroup,
    props: { model }
  });

  return <ModelSection baseClassName="create-form">{renderPaths}</ModelSection>;
};

ModelCreateFormBase.propTypes = {};

const ModelCreateForm = (props) =>
  useGlobalComponent('ModelCreateForm', ModelCreateFormBase, props);

export default ModelCreateForm;
