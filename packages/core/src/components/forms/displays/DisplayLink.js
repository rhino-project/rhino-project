import { useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const DisplayLinkBase = ({
  accessor,
  children,
  empty = '-',
  ...props
}) => {
  const { path } = props;
  const {
    field: { value: fieldValue }
  } = useController({ name: path });

  const value = useMemo(
    () => (accessor ? accessor(fieldValue) : fieldValue),
    [accessor, fieldValue]
  );

  return <div>{value ? <a href={value}>{children || value}</a> : empty}</div>;
};

const DisplayLink = (props) =>
  useGlobalComponent('DisplayLink', DisplayLinkBase, props);

export default DisplayLink;
