import PropTypes from 'prop-types';

import { useGlobalComponent, useGlobalOverrides } from 'rhino/hooks/overrides';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import ModelEditHeader from './ModelEditHeader';
import ModelEditForm from './ModelEditForm';
import ModelEditActions from './ModelEditActions';
import ModelEditSimple from './ModelEditSimple';

const defaultComponents = {
  ModelEditHeader,
  ModelEditForm,
  ModelEditActions
};

export const ModelEditBase = ({
  overrides,
  fallback = true,
  wrapper,
  ...props
}) => {
  const { model } = props;
  // FIXME: Global overrides shouldn't be done this way
  const {
    ModelEditHeader,
    ModelEditForm,
    ModelEditActions
  } = useGlobalOverrides(defaultComponents, overrides, props);

  if (ModelEditForm().props?.paths)
    console.warn('ModelEditForm pass legacy paths prop');

  return (
    <ModelWrapper model={model} wrapper={wrapper} baseClassName="edit">
      {/* Legacy path support */}
      <ModelEditSimple {...props} paths={ModelEditForm().props?.paths}>
        <ModelEditHeader />
        <ModelEditForm />
        <ModelEditActions />{' '}
      </ModelEditSimple>
    </ModelWrapper>
  );
};

ModelEditBase.propTypes = {
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object,
  paths: PropTypes.array,
  onActionError: PropTypes.func
};

const ModelEdit = (props) => useGlobalComponent(ModelEditBase, props);

export default ModelEdit;
