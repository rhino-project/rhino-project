import PropTypes from 'prop-types';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { breadcrumbFor } from 'rhino/utils/ui';
import ModelShowDescription from 'rhino/components/models/ModelShowDescription';
import ModelShowRelated from 'rhino/components/models/ModelShowRelated';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import ModelShowActions from 'rhino/components/models/ModelShowActions';
import ModelShowBase from './ModelShowBase';
import { useModelShowContext } from 'rhino/hooks/controllers';

export const ModelShowHeader = () => {
  const { model, resource } = useModelShowContext();

  return breadcrumbFor(model, resource, true);
};

const defaultComponents = {
  ModelShow: ModelShowBase,
  ModelShowHeader,
  ModelShowActions,
  ModelShowDescription,
  ModelShowRelated
};

const ModelShow = ({ overrides, ...props }) => {
  const {
    ModelShow,
    ModelShowHeader,
    ModelShowActions,
    ModelShowDescription,
    ModelShowRelated
  } = useGlobalOverrides(defaultComponents, overrides, props);

  return (
    <ModelWrapper {...props} baseClassName="show">
      <ModelShow {...props}>
        <ModelShowHeader />
        <ModelShowActions />
        <ModelShowDescription />
        <ModelShowRelated />
      </ModelShow>
    </ModelWrapper>
  );
};

ModelShow.propTypes = {
  model: PropTypes.object.isRequired,
  modelId: PropTypes.string.isRequired,
  overrides: PropTypes.object
};

export default ModelShow;
