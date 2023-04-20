import { useMemo } from 'react';
import { useController } from 'react-hook-form';

const DisplayImage = ({ accessor, altText, empty = '-', ...props }) => {
  const { path } = props;
  const {
    field: { value: fieldValue }
  } = useController({ name: path });

  const value = useMemo(() => (accessor ? accessor(fieldValue) : fieldValue), [
    accessor,
    fieldValue
  ]);

  if (!value) return <div>{empty}</div>;

  return (
    <img
      src={value}
      alt={altText || value}
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    />
  );
};

export default DisplayImage;
