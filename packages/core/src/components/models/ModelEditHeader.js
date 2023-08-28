import { breadcrumbFor } from 'rhino/utils/ui';
import { useModelEditContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import ModelSection from './ModelSection';

export const ModelEditHeaderBase = (props) => {
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

const ModelEditHeader = (props) =>
  useGlobalComponent('ModelEditHeader', ModelEditHeaderBase, props);

export default ModelEditHeader;
