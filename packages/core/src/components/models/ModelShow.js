import PropTypes from 'prop-types';
import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';
import ModelShowDescription from 'rhino/components/models/ModelShowDescription';
import ModelShowRelated from 'rhino/components/models/ModelShowRelated';
import ModelShowActions from 'rhino/components/models/ModelShowActions';
import ModelShowSimple from './ModelShowSimple';
import ModelShowHeader from './ModelShowHeader';
import ModelSection from './ModelSection';

const defaultComponents = {
  ModelShowHeader,
  ModelShowActions,
  ModelShowDescription,
  ModelShowRelated
};

export const ModelShowBase = ({ overrides, ...props }) => {
  const {
    ModelShowHeader,
    ModelShowActions,
    ModelShowDescription,
    ModelShowRelated
  } = useOverrides(defaultComponents, overrides);

  if (ModelShowDescription().props?.paths)
    console.warn('ModelShowDescription pass legacy paths prop');

  return (
    <ModelShowSimple paths={ModelShowDescription().props?.paths} {...props}>
      <ModelSection baseClassName="show">
        <ModelShowHeader />
        <ModelShowActions />
        <ModelShowDescription />
        <ModelShowRelated />
      </ModelSection>
    </ModelShowSimple>
  );
};

ModelShowBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  modelId: PropTypes.string.isRequired,
  overrides: PropTypes.object
};

const ModelShow = (props) => useGlobalComponent(ModelShowBase, props);

export default ModelShow;
