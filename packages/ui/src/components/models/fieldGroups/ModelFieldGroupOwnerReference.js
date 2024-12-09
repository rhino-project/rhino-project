import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import {
  ModelFieldGroupReference,
  ModelFieldGroupFloatingReference,
  ModelFieldGroupHorizontalReference
} from './ModelFieldGroupReference';
import { useModelAndAttributeFromPath } from '@rhino-project/core/hooks';
import { useMemo } from 'react';
import { useBaseOwnerFilters } from '@rhino-project/core/hooks';
import { getModelFromRef } from '@rhino-project/core/utils';

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

export const ModelFieldGroupOwnerReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupOwnerReference',
    ModelFieldGroupOwnerReferenceVertical,
    props
  );
