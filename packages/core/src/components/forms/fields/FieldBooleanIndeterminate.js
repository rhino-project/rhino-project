import PropTypes from 'prop-types';
import { CustomInput } from 'reactstrap';

import { useController } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFieldInheritedProps } from 'rhino/hooks/form';

// FIXME: This is duplicated from in ModelFilterBoolean
// Ensure that if the value is a string coming from the url, it is either 'true' or 'false'
const parseBooleanFilterValue = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return null;

  const normalized = value.trim().replace(/ /g, '').toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return null;
};

const FieldBooleanIndeterminate = (props) => {
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const { path } = props;
  const {
    field: { ref, value, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });
  const indeterminateRef = useRef(null);

  const parsedValue = parseBooleanFilterValue(value);
  const indeterminate = useMemo(
    () => parsedValue !== true && parsedValue !== false,
    [parsedValue]
  );

  // Necessary to set indeterminate state
  // https://react-hook-form.com/faqs#Howtosharerefusage
  const innerRef = useCallback(
    (e) => {
      ref(e);
      indeterminateRef.current = e;
    },
    [ref]
  );

  useEffect(() => {
    indeterminateRef.current.indeterminate = indeterminate;
  }, [indeterminateRef, indeterminate]);

  // FIXME: Cannot guarantee that id will be unique
  return (
    <CustomInput
      {...extractedProps}
      {...fieldProps}
      type="checkbox"
      innerRef={innerRef}
      invalid={!!error}
      checked={parsedValue === true}
      {...inheritedProps}
    />
  );
};

FieldBooleanIndeterminate.propTypes = {
  path: PropTypes.string.isRequired
};

export default FieldBooleanIndeterminate;
