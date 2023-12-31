import { useModelCreateContext } from 'rhino/hooks/controllers';
import { useGlobalComponentForModel } from 'rhino/hooks/overrides';
import ModelSection from './ModelSection';
import ModelFieldGroup from './ModelFieldGroup';
import { useRenderPaths } from 'rhino/hooks/paths';
import FormErrors from '../forms/FormErrors';

export const ModelCreateFormBase = (props) => {
  const { model, paths } = useModelCreateContext();
  const renderPaths = useRenderPaths(props.paths || paths, {
    Component: ModelFieldGroup,
    props: { model }
  });

  return (
    <ModelSection baseClassName="create-form">
      <FormErrors />
      {renderPaths}
    </ModelSection>
  );
};

ModelCreateFormBase.propTypes = {};

const ModelCreateForm = (props) =>
  useGlobalComponentForModel('ModelCreateForm', ModelCreateFormBase, props);

export default ModelCreateForm;
