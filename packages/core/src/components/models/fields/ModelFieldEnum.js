import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import FieldSelectControlled from 'rhino/components/forms/fields/FieldSelectControlled';
import { useGlobalComponent } from 'rhino/hooks/overrides';
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

ModelFieldEnumBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldEnum = (props) =>
  useGlobalComponent('ModelFieldEnum', ModelFieldEnumBase, props);

export default ModelFieldEnum;
