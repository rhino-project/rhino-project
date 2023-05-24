import { useModelShowContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import ModelSection from './ModelSection';

export const ModelShowDescriptionBase = (props) => {
  const { renderPaths } = useModelShowContext();

  return (
    <ModelSection baseClassName="show-description">{renderPaths}</ModelSection>
  );
};

ModelShowDescriptionBase.propTypes = {};

const ModelShowDescription = (props) =>
  useGlobalComponent('ModelShowDescription', ModelShowDescriptionBase, props);

export default ModelShowDescription;
