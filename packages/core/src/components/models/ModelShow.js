import PropTypes from 'prop-types';
import { useGlobalComponent, useGlobalOverrides } from 'rhino/hooks/overrides';
import ModelShowDescription from 'rhino/components/models/ModelShowDescription';
import ModelShowRelated from 'rhino/components/models/ModelShowRelated';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import ModelShowActions from 'rhino/components/models/ModelShowActions';
import ModelShowSimple from './ModelShowSimple';
import ModelShowHeader from './ModelShowHeader';

const defaultComponents = {
  ModelShowHeader,
  ModelShowActions,
  ModelShowDescription,
  ModelShowRelated
};

export const ModelShowBase = ({ overrides, wrapper, ...props }) => {
  const {
    ModelShowHeader,
    ModelShowActions,
    ModelShowDescription,
    ModelShowRelated
  } = useGlobalOverrides(defaultComponents, overrides, props);
  const { model } = props;

  return (
    <ModelShowSimple {...props}>
      <ModelWrapper model={model} wrapper={wrapper} baseClassName="show">
        <ModelShowHeader />
        <ModelShowActions />
        <ModelShowDescription />
        <ModelShowRelated />
      </ModelWrapper>
    </ModelShowSimple>
  );
};

ModelShowBase.propTypes = {
  model: PropTypes.object.isRequired,
  modelId: PropTypes.string.isRequired,
  overrides: PropTypes.object
};

const ModelShow = (props) => useGlobalComponent(ModelShowBase, props);

export default ModelShow;
