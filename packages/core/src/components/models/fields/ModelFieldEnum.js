import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import FieldSelectControlled from 'rhino/components/forms/fields/FieldSelectControlled';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';
import { enumFromIndexWithTitle } from 'rhino/utils/ui';

export const ModelFieldEnumBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  const options = useMemo(
    () =>
      enumFromIndexWithTitle(attribute?.enum, `${attribute.readableName}...`),
    [attribute]
  );

  const accessor = useCallback((value) => value || -1, []);

  return (
    <FieldSelectControlled accessor={accessor} {...props}>
      {options}
    </FieldSelectControlled>
  );
};

const defaultComponents = { ModelFieldEnum: ModelFieldEnumBase };

const ModelFieldEnum = ({ overrides, ...props }) => {
  const { ModelFieldEnum } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldEnum {...props} />;
};

ModelFieldEnum.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldEnum;
