import PropTypes from 'prop-types';

import { useGlobalOverrides } from 'rhino/hooks/overrides';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import ModelEditBase from './ModelEditBase';
import ModelEditHeader from './ModelEditHeader';
import ModelEditForm from './ModelEditForm';
import ModelEditActions from './ModelEditActions';

const defaultComponents = {
  ModelEdit: ModelEditBase,
  ModelEditHeader,
  ModelEditForm,
  ModelEditActions
};

const ModelEdit = ({ overrides, ...props }) => {
  const { model } = props;
  // FIXME: Global overrides shouldn't be done this way
  const {
    ModelEdit,
    ModelEditHeader,
    ModelEditForm,
    ModelEditActions
  } = useGlobalOverrides(defaultComponents, overrides, props);

  if (ModelEditForm().props?.paths)
    console.warn('ModelEditForm pass legacy paths prop');

  return (
    <ModelWrapper model={model} {...props} baseClassName="edit">
      {/* Legacy */}
      <ModelEdit paths={ModelEditForm().props?.paths} {...props}>
        <ModelEditHeader />
        <ModelEditForm />
        <ModelEditActions />
      </ModelEdit>
    </ModelWrapper>
  );
};

ModelEdit.propTypes = {
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object,
  paths: PropTypes.array,
  onActionError: PropTypes.func
};

export default ModelEdit;
