import PropTypes from 'prop-types';
import { CustomInput } from 'reactstrap';

import { useController } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFieldInheritedProps } from 'rhino/hooks/form';

const FieldBooleanIndeterminate = (props) => {
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const { path } = props;
  const {
    field: { ref, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });
  const { value } = fieldProps;
  const indeterminateRef = useRef(null);

  const indeterminate = useMemo(() => value !== true && value !== false, [
    value
  ]);

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
      checked={value === true}
      {...inheritedProps}
    />
  );
};

FieldBooleanIndeterminate.propTypes = {
  path: PropTypes.string.isRequired
};

export default FieldBooleanIndeterminate;
