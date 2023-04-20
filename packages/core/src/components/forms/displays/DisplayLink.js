import { useMemo } from 'react';
import { useController } from 'react-hook-form';

const DisplayLink = ({ accessor, children, empty = '-', ...props }) => {
  const { path } = props;
  const {
    field: { value: fieldValue }
  } = useController({ name: path });

  const value = useMemo(() => (accessor ? accessor(fieldValue) : fieldValue), [
    accessor,
    fieldValue
  ]);

  return <div>{value ? <a href={value}>{children || value}</a> : empty}</div>;
};

export default DisplayLink;
