import React, { ReactNode, useMemo, useState } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { FieldInput, FieldInputProps } from './FieldInput';
import { FieldTextarea, FieldTextareaProps } from './FieldTextarea';
import { parseDate } from '@internationalized/date';
import { FieldDatePicker, FieldDatePickerProps } from './FieldDatePicker';
import { FieldTimeInput, FieldTimeInputProps } from './FieldTimeInput';
import { Alert, Checkbox, CheckboxProps, SelectItem } from '@heroui/react';
import {
  FieldValues,
  Path,
  useController,
  useFormContext
} from 'react-hook-form';
import { Uploader } from '@rhino-project/core/utils';
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput
} from 'react-international-phone';
import { Icon, IconProps } from '@iconify/react';
import { FieldNumberInput, FieldNumberInputProps } from './FieldNumberInput';
import { FieldSelect, FieldSelectProps } from './FieldSelect';

// Types
export type FieldBooleanProps = CheckboxProps & {
  /**
   * The function to format the value before displaying it.
   */
  accessor?: (value: unknown) => boolean | string | null | undefined;
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
export type FieldCountryProps = FieldSelectProps;
export type FieldCurrencyProps = FieldNumberInputProps;
export type FieldDateProps = FieldDatePickerProps;
export type FieldDateTimeProps = FieldDatePickerProps;
export type FieldFileProps<T extends FieldValues = FieldValues> = {
  path: Path<T>;
  label: ReactNode;
  description: ReactNode;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
};
export type FieldFloatProps = FieldNumberInputProps;
export type FieldHiddenProps = FieldInputProps;
export type FieldIntegerProps = FieldNumberInputProps;
export type FieldPasswordProps = FieldInputProps;
export type FieldPhoneProps = FieldInputProps;
export type FieldStringProps = FieldInputProps;
export type FieldTextProps = FieldTextareaProps;
export type FieldTimeProps = FieldTimeInputProps;
export type FieldYearProps = FieldIntegerProps;

// Boolean
export const FieldBooleanBase = React.forwardRef<
  HTMLInputElement,
  FieldBooleanProps
>(({ accessor, path, ...props }, ref) => {
  const {
    field: { disabled, value: fieldValue, ...fieldProps },
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
      // @ts-expect-error FIXME: Imperative handle for ref sharing
      ref={ref}
      // FIXME is this right for editing? maybe only if isClearable
      isIndeterminate={value !== true && value !== false}
      isSelected={value || false}
      isInvalid={!!error}
      isDisabled={disabled}
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
      // @ts-expect-error FIXME: Imperative handle for ref sharing
      ref={ref}
      {...fieldProps}
      {...props}
    />
  );
});
FieldBooleanIconBase.displayName = 'FieldBooleanIconBase';

// Country
export const FieldCountryBase = React.forwardRef<
  HTMLSelectElement,
  FieldCountryProps
>((props, ref) => {
  return (
    <FieldSelect ref={ref} {...props}>
      {defaultCountries.map((c) => {
        const country = parseCountry(c);
        return (
          <SelectItem
            key={country.iso2}
            textValue={country.name}
            startContent={<FlagImage className="size-6" iso2={country.iso2} />}
          >
            {country.name}
          </SelectItem>
        );
      })}
    </FieldSelect>
  );
});
FieldCountryBase.displayName = 'FieldCountryBase';

// Currency
export const FieldCurrencyBase = React.forwardRef<
  HTMLInputElement,
  FieldCurrencyProps
>((props, ref) => (
  <FieldNumberInput
    ref={ref}
    formatOptions={{
      style: 'currency',
      currency: 'USD'
    }}
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
const FieldFileBase = <T extends FieldValues = FieldValues>({
  path,
  label,
  description,
  multiple,
  accept = '*/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5
}: FieldFileProps<T>) => {
  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });
  const { setError, clearErrors } = useFormContext();

  const validateFile = (file: File) => {
    if (file.size > maxSize) {
      return `Files must be smaller than ${maxSize / 1024 / 1024}MB`;
    }

    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const selectedFiles = Array.from(fileList);

    if (selectedFiles.length === 0) return;

    if (multiple && selectedFiles.length > maxFiles) {
      setError(path, {
        type: 'custom',
        message: `You can only upload up to ${maxFiles} files`
      });
      return;
    }

    const errors = selectedFiles.map(validateFile).filter(Boolean);
    if (errors.length > 0) {
      setError(path, {
        type: 'custom',
        message: errors[0] || 'Invalid file'
      });
      return;
    }

    const newFiles = [] as { signed_id: string; display_name: string }[];

    const uploaders = selectedFiles.map((file, idx) => {
      const uploader = new Uploader({ id: `${path}-${idx}` }, file, () => null);

      return uploader
        .begin()
        .then((arg) => newFiles.push({ ...arg, display_name: arg.filename }));
    });

    Promise.all(uploaders)
      .then(() => onChange(multiple ? [...value, ...newFiles] : newFiles[0]))
      .catch((arg) =>
        setError(path, {
          type: 'custom',
          message: arg
        })
      );
  };

  const handleRemoveFile = (fileToRemove: { signed_id: string }) => {
    if (multiple && Array.isArray(value)) {
      const newFiles = value.filter(
        (file: { signed_id: string }) =>
          file.signed_id !== fileToRemove.signed_id
      );
      onChange(newFiles);
    } else {
      onChange(null);
    }
    clearErrors(path);
  };

  const handleRemoveAllFiles = () => {
    onChange(multiple ? [] : null);
    clearErrors(path);
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
        {files.map(
          (file: { display_name: string; signed_id: string }, index) => (
            <div
              key={`${file.display_name}-${index}`}
              className="p-4 bg-default-50 rounded-lg flex items-center justify-between"
            >
              <div className="truncate flex-1">
                <p className="text-sm font-medium text-foreground-500">
                  {file.display_name}
                </p>
                {/* <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p> */}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(file)}
                className="ml-4 text-default-500 hover:text-danger-600"
              >
                <Icon className="w-5 h-5" icon="bi:x" />
              </button>
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div className="bg-default-100 hover:bg-default-200 rounded-medium">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full p-4 h-32 cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-2">
            <div className="text-small">{label}</div>
            <Icon className="w-8 h-8 text-foreground-400" icon="bi:upload" />
            <p className="text-small text-foreground-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            {description && (
              <p className="text-tiny text-foreground-400">{description}</p>
            )}
          </div>
          <input
            {...fieldProps}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div className="p-2">
        {error && <Alert color="danger">{error.message}</Alert>}

        {renderFileList()}
      </div>
    </div>
  );
};

// Float
export const FieldFloatBase = React.forwardRef<
  HTMLInputElement,
  FieldFloatProps
>((props, ref) => <FieldNumberInput ref={ref} {...props} />);
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
>((props, ref) => (
  <FieldNumberInput
    ref={ref}
    formatOptions={{
      maximumFractionDigits: 0
    }}
    {...props}
  />
));
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
  const { path } = props;
  const { setValue } = useFormContext();
  const { country, handlePhoneValueChange, inputValue } = usePhoneInput({
    defaultCountry: 'us',
    countries: defaultCountries,
    onChange: ({ phone }) => setValue(path, phone, { shouldDirty: true })
  });

  return (
    <FieldInput
      ref={ref}
      value={inputValue}
      onChange={handlePhoneValueChange}
      startContent={<FlagImage className="size-6" iso2={country.iso2} />}
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
  // @ts-expect-error FIXME: Imperative handle for ref sharing
>((props, ref) => <FieldTextarea ref={ref} {...props} />);
FieldTextBase.displayName = 'FieldTextBase';

// Time
export const FieldTimeBase = React.forwardRef<HTMLInputElement, FieldTimeProps>(
  (props, ref) => <FieldTimeInput ref={ref} {...props} />
);
FieldTimeBase.displayName = 'FieldTimeBase';

// Year
export const FieldYearBase = React.forwardRef<HTMLInputElement, FieldYearProps>(
  (props, ref) => (
    <FieldNumberInput
      ref={ref}
      formatOptions={{
        maximumFractionDigits: 0,
        useGrouping: false
      }}
      {...props}
    />
  )
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

export const FieldYear = (props: FieldYearProps) =>
  useGlobalComponent('FieldYear', FieldYearBase, props);
