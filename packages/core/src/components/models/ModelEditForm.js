import PropTypes from 'prop-types';

import { useGlobalOverrides } from 'rhino/hooks/overrides';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelEditContext } from 'rhino/hooks/controllers';

export const ModelEditFormBase = (props) => {
  const { model, renderPaths } = useModelEditContext();

  return (
    <ModelWrapper model={model} {...props} baseClassName="edit-form">
      {renderPaths}
    </ModelWrapper>
  );
};

const defaultComponents = {
  ModelEditForm: ModelEditFormBase
};

const ModelEditForm = ({ overrides, ...props }) => {
  const { ModelEditForm } = useGlobalOverrides(defaultComponents, overrides);

  return <ModelEditForm {...props} />;
};

ModelEditForm.propTypes = {
  overrides: PropTypes.object
};

export default ModelEditForm;
