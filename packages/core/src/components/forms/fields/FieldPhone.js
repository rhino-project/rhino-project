import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useController } from 'react-hook-form';
import { useMemo } from 'react';

import { useFieldInheritedProps } from '../../../hooks/form';
import PhoneInput from 'react-phone-input-2';
import { useGlobalComponent } from '../../../hooks/overrides';

export const FieldPhoneBase = (props) => {
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

FieldPhoneBase.propTypes = {
  path: PropTypes.string.isRequired
};

export const FieldPhone = (props) =>
  useGlobalComponent('FieldPhone', FieldPhoneBase, props);
