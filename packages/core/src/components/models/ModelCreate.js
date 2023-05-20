import PropTypes from 'prop-types';

import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import ModelCreateHeader from './ModelCreateHeader';
import ModelCreateForm from './ModelCreateForm';
import ModelCreateActions from './ModelCreateActions';
import ModelCreateSimple from './ModelCreateSimple';

const defaultComponents = {
  ModelCreateHeader,
  ModelCreateForm,
  ModelCreateActions
};

export const ModelCreateBase = ({ overrides, ...props }) => {
  const {
    ModelCreateHeader,
    ModelCreateForm,
    ModelCreateActions
  } = useOverrides(defaultComponents, overrides);

  if (ModelCreateForm().props?.paths)
    console.warn('ModelCreateForm pass legacy paths prop');

  return (
    <ModelCreateSimple paths={ModelCreateForm().props?.paths} {...props}>
      <ModelWrapper {...props} baseClassName="create">
        <ModelCreateHeader />
        <ModelCreateForm />
        <ModelCreateActions />
      </ModelWrapper>
    </ModelCreateSimple>
  );
};

ModelCreateBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  overrides: PropTypes.object
};

const ModelCreate = (props) => useGlobalComponent(ModelCreateBase, props);

export default ModelCreate;
