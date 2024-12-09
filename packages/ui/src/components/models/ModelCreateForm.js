import { useModelCreateContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { useRenderPaths } from '../../hooks/renderPaths';
import { ModelFieldGroup } from './ModelFieldGroup';
import { ModelSection } from './ModelSection';
import { FormErrors } from '../forms/FormErrors';

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

export const ModelCreateForm = (props) =>
  useGlobalComponentForModel('ModelCreateForm', ModelCreateFormBase, props);
