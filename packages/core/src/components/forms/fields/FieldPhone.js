import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useController } from 'react-hook-form';
import { useMemo } from 'react';

import { useFieldInheritedProps } from 'rhino/hooks/form';
import PhoneInput from 'react-phone-input-2';

const FieldPhone = (props) => {
  const { path } = props;
  const {
    field: fieldProps,
    fieldState: { error }
  } = useController({
    name: path
  });

  const containerClass = useMemo(
    () => classnames({ 'is-invalid': error }),
    [error]
  );

  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);

  return (
    <PhoneInput
      containerClass={containerClass}
      {...extractedProps}
      {...fieldProps}
      country="us"
      preferredCountries={['us', 'ca']}
      regions={['north-america', 'europe']}
      {...inheritedProps}
    />
  );
};

FieldPhone.propTypes = {
  path: PropTypes.string.isRequired
};

export default FieldPhone;
