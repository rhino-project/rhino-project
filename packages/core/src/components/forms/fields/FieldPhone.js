import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useController } from 'react-hook-form';
import { useMemo } from 'react';

import { useFieldInheritedProps } from '../../../hooks/form';
import P from 'react-phone-input-2';
import { useGlobalComponent } from '../../../hooks/overrides';

// Different behavior in Vite (rollup vs esbuild) causes the need for this check
// https://github.com/bl00mber/react-phone-input-2/issues/599
// https://github.com/vitejs/vite/issues/4704
// https://github.com/vitejs/vite/issues/2139#issuecomment-824557740
const PhoneInput = P.default ? P.default : P;

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
