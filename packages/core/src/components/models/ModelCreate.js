import PropTypes from 'prop-types';

import { useGlobalOverrides } from 'rhino/hooks/overrides';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import ModelCreateBase from './ModelCreateBase';
import ModelCreateHeader from './ModelCreateHeader';
import ModelCreateForm from './ModelCreateForm';
import ModelCreateActions from './ModelCreateActions';

const defaultComponents = {
  ModelCreate: ModelCreateBase,
  ModelCreateHeader,
  ModelCreateForm,
  ModelCreateActions
};

const ModelCreate = ({ overrides, ...props }) => {
  // FIXME: Global overrides shouldn't be done this way
  const {
    ModelCreate,
    ModelCreateHeader,
    ModelCreateForm,
    ModelCreateActions
  } = useGlobalOverrides(defaultComponents, overrides, props);

  if (ModelCreateForm().props?.paths)
    console.warn('ModelCreateForm pass legacy paths prop');

  return (
    <ModelWrapper {...props} baseClassName="create">
      <ModelCreate paths={ModelCreateForm().props?.paths} {...props}>
        <ModelCreateHeader />
        <ModelCreateForm />
        <ModelCreateActions />
      </ModelCreate>
    </ModelWrapper>
  );
};

ModelCreate.propTypes = {
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object
};

export default ModelCreate;
