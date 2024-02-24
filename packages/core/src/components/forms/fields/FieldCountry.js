import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useController } from 'react-hook-form';
import { useMemo } from 'react';
import { useGlobalComponent } from '../../../hooks/overrides';
import { CloseButton } from '../../buttons';
import P from 'react-phone-input-2';

// Different behavior in Vite (rollup vs esbuild) causes the need for this check
// https://github.com/bl00mber/react-phone-input-2/issues/599
// https://github.com/vitejs/vite/issues/4704
// https://github.com/vitejs/vite/issues/2139#issuecomment-824557740
const PhoneInput = P.default ? P.default : P;

export const Flag = ({ country }) => {
  const lowerValue = useMemo(() => country?.toLowerCase(), [country]);

  if (!lowerValue) return null;

  return (
    <div className="country-flag-display react-tel-input d-inline-block ms-2">
      <div className={classnames('flag', lowerValue)} />
    </div>
  );
};

Flag.propTypes = {
  country: PropTypes.string.isRequired
};

export const FieldCountryBase = ({ required, ...props }) => {
  const { path } = props;
  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const handleCountryChange = (_, country) => onChange(country.countryCode);
  const handleClear = () => onChange('');

  const lowerValue = useMemo(() => value?.toLowerCase(), [value]);
  const upperValue = useMemo(() => value?.toUpperCase(), [value]);

  return (
    <div className={classnames('country-field', { 'is-invalid': error })}>
      <div className="country-label">
        {upperValue}
        {!required && upperValue && <CloseButton onClick={handleClear} />}
      </div>
      <PhoneInput
        {...fieldProps}
        containerClass={classnames('country-input', 'form-control', {
          'is-invalid': error
        })}
        country={lowerValue}
        preferredCountries={['us', 'ca']}
        regions={['north-america', 'europe']}
        onChange={handleCountryChange}
        enableSearch
        isValid
        {...props}
      />
    </div>
  );
};

FieldCountryBase.propTypes = {
  path: PropTypes.string.isRequired
};

export const FieldCountry = (props) =>
  useGlobalComponent('FieldCountry', FieldCountryBase, props);
