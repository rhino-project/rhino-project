import { useCallback, useMemo } from 'react';
import FieldInputControlled from './FieldInputControlled';

export const FieldSelectControlled = ({ children, title, ...props }) => {
  const options = useMemo(() => {
    if (!title) return children;

    return [
      <option key="placeholder" disabled value="-1">
        {title}
      </option>,
      ...(children ? children : [])
    ];
  }, [children, title]);

  const accessor = useCallback((value) => value || '-1', []);

  return (
    <FieldInputControlled type="select" accessor={accessor} {...props}>
      {options}
    </FieldInputControlled>
  );
};

export default FieldSelectControlled;
