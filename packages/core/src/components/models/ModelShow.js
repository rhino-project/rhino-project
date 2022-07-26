import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import { useOverridesWithGlobal } from 'rhino/hooks/overrides';
import { breadcrumbFor } from 'rhino/utils/ui';
import ModelShowDescription from 'rhino/components/models/ModelShowDescription';
import ModelShowRelated from 'rhino/components/models/ModelShowRelated';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelShow } from 'rhino/hooks/queries';
import ModelShowActions from 'rhino/components/models/ModelShowActions';

const ModelShowHeader = ({ model, resource }) => {
  return breadcrumbFor(model, resource, true);
};

const defaultComponents = {
  ModelShowHeader,
  ModelShowActions,
  ModelShowDescription,
  ModelShowRelated
};

const ModelShow = ({ overrides, ...props }) => {
  const { model, modelId } = props;
  const {
    ModelShowHeader,
    ModelShowActions,
    ModelShowDescription,
    ModelShowRelated
  } = useOverridesWithGlobal(model, 'show', defaultComponents, overrides);

  const { isLoading, resource } = useModelShow(model, modelId);

  if (isLoading) {
    return <Spinner className="mx-auto d-block" />;
  }

  return (
    <ModelWrapper {...props} baseClassName="show">
      <ModelShowHeader {...props} resource={resource} />
      <ModelShowActions {...props} resource={resource} />
      <ModelShowDescription {...props} resource={resource} />
      <ModelShowRelated {...props} resource={resource} />
    </ModelWrapper>
  );
};

ModelShow.propTypes = {
  model: PropTypes.object.isRequired,
  modelId: PropTypes.string.isRequired,
  overrides: PropTypes.object
};

export default ModelShow;
