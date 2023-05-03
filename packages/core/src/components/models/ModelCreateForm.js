import PropTypes from 'prop-types';

import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelCreateContext } from 'rhino/hooks/controllers';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

export const ModelCreateFormBase = ({ overrides, ...props }) => {
  const { model, renderPaths } = useModelCreateContext();

  return (
    <ModelWrapper model={model} {...props} baseClassName="create-form">
      {renderPaths}
    </ModelWrapper>
  );
};

const defaultComponents = {
  ModelCreateForm: ModelCreateFormBase
};

const ModelCreateForm = ({ overrides, ...props }) => {
  const { ModelCreateForm } = useGlobalOverrides(defaultComponents, overrides);

  return <ModelCreateForm {...props} />;
};

ModelCreateForm.propTypes = {
  overrides: PropTypes.object
};

export default ModelCreateForm;
