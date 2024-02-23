import { forwardRef, useRef, useEffect } from 'react';
import { Input } from 'reactstrap';

const IndeterminateCheckboxComponent = ({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    if (resolvedRef) resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <Input type="checkbox" innerRef={resolvedRef} {...rest} />;
};

export const IndeterminateCheckbox = forwardRef(IndeterminateCheckboxComponent);
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';
