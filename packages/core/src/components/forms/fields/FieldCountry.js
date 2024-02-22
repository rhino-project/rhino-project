import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useController } from 'react-hook-form';
import { useMemo } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { CloseButton } from 'rhino/components/buttons';
import PhoneInput from 'react-phone-input-2';

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

const FieldCountry = (props) =>
  useGlobalComponent('FieldCountry', FieldCountryBase, props);

export default FieldCountry;
