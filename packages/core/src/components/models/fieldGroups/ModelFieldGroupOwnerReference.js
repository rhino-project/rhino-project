import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import ModelFieldGroupReference, {
  ModelFieldGroupFloatingReference,
  ModelFieldGroupHorizontalReference
} from './ModelFieldGroupReference';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';
import { useMemo } from 'react';
import { useBaseOwnerFilters } from 'rhino/hooks/owner';
import { getModelFromRef } from 'rhino/utils/models';

const ModelFieldGroupOwnerReferenceVertical = ({
  filter: extraFilters,
  ...props
}) => {
  const { model, path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const filter = useBaseOwnerFilters(refModel, { extraFilters });

  return <ModelFieldGroupReference filter={filter} {...props} />;
};

ModelFieldGroupOwnerReferenceVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalOwnerReference = ({
  filter: extraFilters,
  ...props
}) => {
  // FIXME: Extract this to a hook
  const { model, path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const filter = useBaseOwnerFilters(refModel, { extraFilters });

  return <ModelFieldGroupHorizontalReference filter={filter} {...props} />;
};

export const ModelFieldGroupFloatingOwnerReference = ({
  filter: extraFilters,
  ...props
}) => {
  // FIXME: Extract this to a hook
  const { model, path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const filter = useBaseOwnerFilters(refModel, { extraFilters });

  return <ModelFieldGroupFloatingReference filter={filter} {...props} />;
};

const ModelFieldGroupOwnerReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupOwnerReference',
    ModelFieldGroupOwnerReferenceVertical,
    props
  );

export default ModelFieldGroupOwnerReference;
