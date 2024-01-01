import { useGlobalComponentForModel } from 'rhino/hooks/overrides';
import { useModelEditContext } from 'rhino/hooks/controllers';
import ModelSection from './ModelSection';
import ModelFieldGroup from './ModelFieldGroup';
import { useRenderPaths } from 'rhino/hooks/paths';
import FormErrors from '../forms/FormErrors';

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

const ModelEditForm = (props) =>
  useGlobalComponentForModel('ModelEditForm', ModelEditFormBase, props);

export default ModelEditForm;
