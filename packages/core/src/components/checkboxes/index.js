import { forwardRef, useRef, useEffect } from 'react';
import { Input } from 'reactstrap';

export const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      if (resolvedRef) resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return <Input type="checkbox" innerRef={resolvedRef} {...rest} />;
  }
);
