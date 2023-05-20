import PropTypes from 'prop-types';

import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';
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

export const ModelEditBase = ({ overrides, wrapper, ...props }) => {
  const { model } = props;
  const { ModelEditHeader, ModelEditForm, ModelEditActions } = useOverrides(
    defaultComponents,
    overrides
  );

  if (ModelEditForm().props?.paths)
    console.warn('ModelEditForm pass legacy paths prop');

  return (
    <ModelWrapper model={model} wrapper={wrapper} baseClassName="edit">
      {/* Legacy path support */}
      <ModelEditSimple paths={ModelEditForm().props?.paths} {...props}>
        <ModelEditHeader />
        <ModelEditForm />
        <ModelEditActions />{' '}
      </ModelEditSimple>
    </ModelWrapper>
  );
};

ModelEditBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  overrides: PropTypes.object,
  paths: PropTypes.array,
  onActionError: PropTypes.func
};

const ModelEdit = (props) => useGlobalComponent(ModelEditBase, props);

export default ModelEdit;
