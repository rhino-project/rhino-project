import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import ModelFieldReference from './ModelFieldReference';
import { useBaseOwnerFilters } from 'rhino/hooks/owner';
import { getModelFromRef } from 'rhino/utils/models';
import { useMemo } from 'react';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

export const ModelFieldOwnerReferenceBase = ({
  filter: extraFilters,
  ...props
}) => {
  const { model, path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const filter = useBaseOwnerFilters(refModel, { extraFilters });

  return <ModelFieldReference filter={filter} {...props} />;
};

const ModelFieldOwnerReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldOwnerReference',
    ModelFieldOwnerReferenceBase,
    props
  );

export default ModelFieldOwnerReference;
