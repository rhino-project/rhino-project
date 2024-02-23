import { useModelEditContext } from '../../hooks/controllers';
import { useGlobalComponentForModel } from '../../hooks/overrides';
import { useRenderPaths } from '../../hooks/renderPaths';
import { ModelFieldGroup } from './ModelFieldGroup';
import { ModelSection } from './ModelSection';
import { FormErrors } from '../forms/FormErrors';

export const ModelEditFormBase = (props) => {
  const { model, paths } = useModelEditContext();
  const renderPaths = useRenderPaths(props.paths || paths, {
    Component: ModelFieldGroup,
    props: { model }
  });

  return (
    <ModelSection baseClassName="edit-form">
      <FormErrors />
      {renderPaths}
    </ModelSection>
  );
};

ModelEditFormBase.propTypes = {};

export const ModelEditForm = (props) =>
  useGlobalComponentForModel('ModelEditForm', ModelEditFormBase, props);
