import { useModelShowContext } from 'rhino/hooks/controllers';
import { useGlobalComponentForModel } from 'rhino/hooks/overrides';
import { useRenderPaths } from 'rhino/hooks/renderPaths';
import ModelDisplayGroup from './ModelDisplayGroup';
import ModelSection from './ModelSection';
import FormErrors from '../forms/FormErrors';

export const ModelShowDescriptionBase = (props) => {
  const { model, paths } = useModelShowContext();
  const renderPaths = useRenderPaths(props.paths || paths, {
    Component: ModelDisplayGroup,
    props: { model }
  });

  return (
    <ModelSection baseClassName="show-description">
      <FormErrors />
      {renderPaths}
    </ModelSection>
  );
};

ModelShowDescriptionBase.propTypes = {};

const ModelShowDescription = (props) =>
  useGlobalComponentForModel(
    'ModelShowDescription',
    ModelShowDescriptionBase,
    props
  );

export default ModelShowDescription;
