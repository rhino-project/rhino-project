import { breadcrumbFor } from 'rhino/utils/ui';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelEditContext } from 'rhino/hooks/controllers';

export const ModelEditHeader = (props) => {
  const {
    model,
    show: { resource }
  } = useModelEditContext();

  return (
    <ModelWrapper model={model} {...props} baseClassName="edit-header">
      {breadcrumbFor(model, resource, true)}
    </ModelWrapper>
  );
};

ModelEditHeader.propTypes = {};

export default ModelEditHeader;
