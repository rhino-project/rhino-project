import { useModelShowContext } from 'rhino/hooks/controllers';
import { useGlobalComponentForModel } from 'rhino/hooks/overrides';
import ModelSection from './ModelSection';
import { useRenderPaths } from 'rhino/hooks/paths';
import ModelDisplayGroup from './ModelDisplayGroup';

export const ModelShowDescriptionBase = (props) => {
  const { model, paths } = useModelShowContext();
  const renderPaths = useRenderPaths(paths, {
    Component: ModelDisplayGroup,
    props: { model }
  });

  return (
    <ModelSection baseClassName="show-description">{renderPaths}</ModelSection>
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
