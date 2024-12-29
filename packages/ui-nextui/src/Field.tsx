import React, { useMemo, useRef, useState } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { FieldInput, FieldInputProps } from './FieldInput';
import { FieldTextarea, FieldTextareaProps } from './FieldTextarea';
import { parseDate } from '@internationalized/date';
import { FieldDatePicker, FieldDatePickerProps } from './FieldDatePicker';
import { FieldTimeInput, FieldTimeInputProps } from './FieldTimeInput';
import {
  Alert,
  Checkbox,
  CheckboxProps,
  CircularProgress
} from '@heroui/react';
import { useController } from 'react-hook-form';
import { useUpdate } from 'react-use';
import { Uploader } from '@rhino-project/core/utils';
import {
  CountrySelector,
  CountrySelectorProps,
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput
} from 'react-international-phone';
import { Icon, IconProps } from '@iconify/react';

// Types
export type FieldBooleanProps = CheckboxProps & {
  /**
   * The path inside the form object.
   */
  path: string;
};
export type FieldBooleanIconProps = Omit<IconProps, 'icon'> & {
  /**
   * Icon to display when the value is true.
   */
  trueIcon?: string;
  /**
   * Icon to display when the value is true.
   */
  falseIcon?: string;
  /**
   * The path inside the form object.
   */
  path: string;
};
export type FieldCountryProps = CountrySelectorProps & {
  /**
   * The path inside the form object.
   */
  path: string;
};
export type FieldCurrencyProps = FieldInputProps;
export type FieldDateProps = FieldDatePickerProps;
export type FieldDateTimeProps = FieldDatePickerProps;
export type FieldFileProps = FieldInputProps;
export type FieldFloatProps = FieldInputProps;
export type FieldHiddenProps = FieldInputProps;
export type FieldIntegerProps = FieldInputProps;
export type FieldPasswordProps = FieldInputProps;
export type FieldPhoneProps = FieldInputProps;
export type FieldStringProps = FieldInputProps;
export type FieldTextProps = FieldTextareaProps;
export type FieldTimeProps = FieldTimeInputProps;
export type FieldYearProps = FieldTimeInputProps;

// Boolean
export const FieldBooleanBase = React.forwardRef<
  HTMLInputElement,
  FieldBooleanProps
>(({ accessor, path, ...props }, ref) => {
  const {
    field: { value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const value = useMemo(() => {
    const accessedValue = accessor ? accessor(fieldValue) : fieldValue;

    if (typeof accessedValue === 'boolean') return accessedValue;
    if (typeof accessedValue !== 'string') return null;

    const normalized = accessedValue.trim().replace(/ /g, '').toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;

    return null;
  }, [accessor, fieldValue]);

  return (
    <Checkbox
      // Form controller ref?
      ref={ref}
      // FIXME is this right for editing? maybe only if isClearable
      isIndeterminate={value !== true && value !== false}
      isSelected={value || false}
      isInvalid={!!error}
      {...fieldProps}
      {...props}
    />
  );
});
FieldBooleanBase.displayName = 'FieldBooleanBase';

// Boolean Icon
export const FieldBooleanIconBase = React.forwardRef<
  HTMLInputElement,
  FieldBooleanIconProps
>(({ trueIcon = 'bi:check', falseIcon = 'bi:x', path, ...props }, ref) => {
  const {
    field: { onChange, value, ...fieldProps }
  } = useController({
    name: path
  });

  return (
    <Icon
      icon={value ? trueIcon : falseIcon}
      onClick={() => onChange(!value)}
      ref={ref}
      {...fieldProps}
      {...props}
    />
  );
});
FieldBooleanIconBase.displayName = 'FieldBooleanIconBase';

// Country
export const FieldCountryBase = React.forwardRef<
  HTMLInputElement,
  FieldCountryProps
>((props, ref) => (
  <CountrySelector ref={ref} selectedCountry="ua" {...props} />
));
FieldCountryBase.displayName = 'FieldCountryBase';

// Currency
export const FieldCurrencyBase = React.forwardRef<
  HTMLInputElement,
  FieldCurrencyProps
>((props, ref) => (
  <FieldFloat
    ref={ref}
    startContent={
      <div className="pointer-events-none flex items-center">
        <span className="text-default-400 text-small">$</span>
      </div>
    }
    {...props}
  />
));
FieldCurrencyBase.displayName = 'FieldCurrencyBase';

// Date
// FIXME: Is HTMLInputElement the correct type?
export const FieldDateBase = React.forwardRef<HTMLInputElement, FieldDateProps>(
  (props, ref) => (
    <FieldDatePicker ref={ref} granularity="day" parse={parseDate} {...props} />
  )
);
FieldDateBase.displayName = 'FieldDateBase';

// Date Time
export const FieldDateTimeBase = React.forwardRef<
  HTMLInputElement,
  FieldDateTimeProps
>((props, ref) => <FieldDatePicker ref={ref} {...props} />);
FieldDateTimeBase.displayName = 'FieldDateTimeBase';

// File
const FieldFileBase = ({
  // If value/onChange aren't provided, we'll use internal state
  value: controlledValue,
  onChange: controlledOnChange,
  label,
  multiple = true,
  accept = '.pdf',
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  className = ''
}) => {
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(null);
  const [error, setError] = useState('');
  const [inputKey, setInputKey] = useState(0);

  // Determine if we're in controlled mode
  const isControlled =
    controlledValue !== undefined && controlledOnChange !== undefined;

  // Use controlled or internal value/setter based on mode
  const value = isControlled ? controlledValue : internalValue;
  const setValue = isControlled ? controlledOnChange : setInternalValue;

  const validateFile = (file) => {
    if (!file.type.includes('pdf')) {
      return 'Please select PDF files only';
    }

    if (file.size > maxSize) {
      return `Files must be smaller than ${maxSize / 1024 / 1024}MB`;
    }

    return null;
  };

  const handleFileChange = (event) => {
    const fileList = event.target.files;
    if (!fileList) {
      setValue(multiple ? [] : null);
      return;
    }

    const selectedFiles = Array.from(fileList);

    if (selectedFiles.length === 0) {
      setValue(multiple ? [] : null);
      return;
    }

    if (multiple && selectedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`);
      setValue(Array.isArray(value) ? value : []);
      setInputKey((prev) => prev + 1);
      return;
    }

    const errors = selectedFiles.map(validateFile).filter(Boolean);
    if (errors.length > 0) {
      setError(errors[0] || 'Invalid file');
      setValue(multiple ? (Array.isArray(value) ? value : []) : null);
      setInputKey((prev) => prev + 1);
      return;
    }

    setError('');
    setValue(multiple ? selectedFiles : selectedFiles[0]);
  };

  const handleRemoveFile = (fileToRemove) => {
    if (multiple && Array.isArray(value)) {
      const newFiles = value.filter((file) => file !== fileToRemove);
      setValue(newFiles);
    } else {
      setValue(null);
    }
    setError('');
    setInputKey((prev) => prev + 1);
  };

  const handleRemoveAllFiles = () => {
    setValue(multiple ? [] : null);
    setError('');
    setInputKey((prev) => prev + 1);
  };

  const renderFileList = () => {
    const files =
      multiple && Array.isArray(value) ? value : value ? [value] : [];

    if (files.length === 0) return null;

    return (
      <div className="space-y-2">
        {multiple && files.length > 1 && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRemoveAllFiles}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove All
            </button>
          </div>
        )}
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
          >
            <div className="truncate flex-1">
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveFile(file)}
              className="ml-4 text-gray-500 hover:text-red-600"
            >
              <Icon className="w-5 h-5" icon="bi:x" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full p-4 h-32 rounded-medium cursor-pointer bg-default-100 hover:bg-default-200">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-2">
            <div className="text-small">{label}</div>
            <Icon className="w-8 h-8 text-foreground-400" icon="bi:upload" />
            <p className="text-small text-foreground-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-tiny text-foreground-400">PDF (max. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            // accept=".pdf"
            // onChange={handleFileChange}
          />
        </label>
      </div>

      {/* {error && <div className="text-sm text-red-500">{error}</div>} */}

      {/* {renderFileList()} */}
    </div>
  );
};

// Float
export const FieldFloatBase = React.forwardRef<
  HTMLInputElement,
  FieldFloatProps
>((props, ref) => <FieldInput ref={ref} type="number" {...props} />);
FieldFloatBase.displayName = 'FieldFloatBase';

// Hidden
export const FieldHiddenBase = React.forwardRef<
  HTMLInputElement,
  FieldInputProps
>((props, ref) => <FieldInput ref={ref} type="hidden" {...props} />);
FieldHiddenBase.displayName = 'FieldHiddenBase';

// Integer
export const FieldIntegerBase = React.forwardRef<
  HTMLInputElement,
  FieldIntegerProps
>((props, ref) => <FieldInput ref={ref} type="number" {...props} />);
FieldIntegerBase.displayName = 'FieldIntegerBase';

// Password
export const FieldPasswordBase = React.forwardRef<
  HTMLInputElement,
  FieldPasswordProps
>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FieldInput
      type={showPassword ? 'text' : 'password'}
      endContent={
        <Icon
          className="cursor-pointer"
          icon={showPassword ? 'bi:eye-slash-fill' : 'bi:eye-fill'}
          onClick={() => setShowPassword((show) => !show)}
        />
      }
      ref={ref}
      {...props}
    />
  );
});
FieldPasswordBase.displayName = 'FieldPasswordBase';

// Phone
export const FieldPhoneBase = React.forwardRef<
  HTMLInputElement,
  FieldPhoneProps
>((props, ref) => {
  const { handlePhoneValueChange } = usePhoneInput({
    defaultCountry: 'us',
    countries: defaultCountries
  });

  // console.log('FieldPhoneBase', value);
  return (
    <FieldInput
      ref={ref}
      onChangeAccessor={handlePhoneValueChange}
      {...props}
    />
  );
});
FieldPhoneBase.displayName = 'FieldPhoneBase';

// String
export const FieldStringBase = React.forwardRef<
  HTMLInputElement,
  FieldStringProps
>((props, ref) => <FieldInput ref={ref} {...props} />);
FieldStringBase.displayName = 'FieldStringBase';

// Text
export const FieldTextBase = React.forwardRef<
  HTMLInputElement,
  FieldStringProps
>((props, ref) => <FieldTextarea ref={ref} {...props} />);
FieldTextBase.displayName = 'FieldTextBase';

// Time
export const FieldTimeBase = React.forwardRef<HTMLInputElement, FieldTimeProps>(
  (props, ref) => <FieldTimeInput ref={ref} {...props} />
);
FieldTimeBase.displayName = 'FieldTimeBase';

// Year
export const FieldYearBase = React.forwardRef<HTMLInputElement, FieldYearProps>(
  (props, ref) => <FieldInteger ref={ref} {...props} />
);
FieldYearBase.displayName = 'FieldYearBase';

// Overrideable component exports
export const FieldBoolean = (props: FieldBooleanProps) =>
  useGlobalComponent('FieldBoolean', FieldBooleanBase, props);

export const FieldBooleanIcon = (props: FieldBooleanProps) =>
  useGlobalComponent('FieldBooleanIcon', FieldBooleanIconBase, props);

export const FieldCountry = (props: FieldCountryProps) =>
  useGlobalComponent('FieldCountry', FieldCountryBase, props);

export const FieldCurrency = (props: FieldCurrencyProps) =>
  useGlobalComponent('FieldCurrency', FieldCurrencyBase, props);

export const FieldDate = (props: FieldDateProps) =>
  useGlobalComponent('FieldDate', FieldDateBase, props);

export const FieldDateTime = (props: FieldDateTimeProps) =>
  useGlobalComponent('FieldDateTime', FieldDateTimeBase, props);

export const FieldFile = (props: FieldFileProps) =>
  useGlobalComponent('FieldFile', FieldFileBase, props);

export const FieldFloat = (props: FieldFloatProps) =>
  useGlobalComponent('FieldFloat', FieldFloatBase, props);

export const FieldHidden = (props: FieldInputProps) =>
  useGlobalComponent('FieldHidden', FieldHiddenBase, props);

export const FieldInteger = (props: FieldIntegerProps) =>
  useGlobalComponent('FieldInteger', FieldIntegerBase, props);

export const FieldPassword = (props: FieldPasswordProps) =>
  useGlobalComponent('FieldPassword', FieldPasswordBase, props);

export const FieldPhone = (props: FieldPhoneProps) =>
  useGlobalComponent('FieldPhone', FieldPhoneBase, props);

export const FieldString = (props: FieldStringProps) =>
  useGlobalComponent('FieldString', FieldStringBase, props);

export const FieldText = (props: FieldTextProps) =>
  useGlobalComponent('FieldText', FieldTextBase, props);

export const FieldTime = (props: FieldTimeProps) =>
  useGlobalComponent('FieldTime', FieldTimeBase, props);

export const FieldYear = (props: FieldTimeProps) =>
  useGlobalComponent('FieldYear', FieldYearBase, props);
