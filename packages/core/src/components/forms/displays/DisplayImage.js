import { useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useGlobalComponent } from '../../../hooks/overrides';

export const DisplayImageBase = ({
  accessor,
  altText,
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

  if (!value) return <div>{empty}</div>;

  return (
    <div>
      <img
        src={value}
        alt={altText || value}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};

const DisplayImage = (props) =>
  useGlobalComponent('DisplayImage', DisplayImageBase, props);

export default DisplayImage;
