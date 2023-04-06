import { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import PhoneInput from 'react-phone-input-2';
import { CloseButton } from 'rhino/components/buttons';
import { useController } from 'react-hook-form';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

export const Flag = ({ country }) => {
  const lowerValue = useMemo(() => country?.toLowerCase(), [country]);

  if (!lowerValue) return null;

  return (
    <div className="country-flag-display react-tel-input d-inline-block ml-2">
      <div className={classnames('flag', lowerValue)} />
    </div>
  );
};

Flag.propTypes = {
  country: PropTypes.string.isRequired
};

const ModelFieldCountry = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);
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
      />
      <div className="country-label">
        {upperValue}
        {!attribute.required && <CloseButton onClick={handleClear} />}
      </div>
    </div>
  );
};

ModelFieldCountry.propTypes = {
  path: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  error: PropTypes.string
};

export default ModelFieldCountry;
