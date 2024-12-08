import { breadcrumbFor } from '../../utils/ui';
import { useModelEditContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { ModelSection } from './ModelSection';

export const ModelEditHeaderBase = () => {
  const {
    model,
    show: { resource }
  } = useModelEditContext();

  return (
    <ModelSection baseClassName="edit-header">
      {breadcrumbFor(model, resource, true)}
    </ModelSection>
  );
};

ModelEditHeaderBase.propTypes = {};

export const ModelEditHeader = (props) =>
  useGlobalComponentForModel('ModelEditHeader', ModelEditHeaderBase, props);
