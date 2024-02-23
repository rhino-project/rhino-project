import PropTypes from 'prop-types';

import { Input, Progress } from 'reactstrap';
import { useController } from 'react-hook-form';
import { useMemo, useRef, useState } from 'react';
import { useUpdate } from 'react-use';
import { useGlobalComponent } from '../../../hooks/overrides';
import { Uploader } from '../../../utils/uploader';
import { CloseButton } from '../../buttons';
import { DangerAlert } from '../../alerts';

const fileInputText = (value, multiple, uploadedFileNames) => {
  if (!multiple && typeof value === 'string') return uploadedFileNames[value];

  if (!multiple) return value?.display_name;

  if (!value || value.length === 0) return 'Choose files';

  return `${value?.length} files`;
};

export const FieldFileBase = ({ multiple, required, ...props }) => {
  const { path } = props;
  const {
    field: { ref, value, onChange, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const [uploadingCount, setUploadingCount] = useState(0);
  const [failed, setFailed] = useState(false);
  const [errors, setErrors] = useState(null);
  const [clearCounter, setClearCounter] = useState(0);
  const forceUpdate = useUpdate();
  const uploadedFileIds = useRef([]);
  const uploadedFileNames = useRef({});

  const handleClear = () => {
    // Hack to reset the file input because Input doesn't get an
    // onChange notification if we do input.value = ''
    setClearCounter(clearCounter + 1);

    setUploadingCount(0);
    setFailed(false);
    uploadedFileIds.current = [];
    onChange(multiple ? [] : null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setUploadingCount(files.length);
    setFailed(false);
    uploadedFileIds.current = [];

    const uploaders = files.map((file, idx) => {
      const uploader = new Uploader({ id: `${path}-${idx}` }, file, () => null);

      return uploader.begin().then((arg) => {
        uploadedFileNames.current[arg.signed_id] = arg.filename;
        uploadedFileIds.current.push(arg.signed_id);
        forceUpdate();
      });
    });

    Promise.all(uploaders)
      .then(() => {
        const existing = multiple
          ? (value || []).map((a) => a.signed_id)
          : null;

        onChange(
          multiple
            ? [...existing, ...uploadedFileIds.current]
            : uploadedFileIds.current[0]
        );

        setClearCounter(clearCounter + 1);
        setUploadingCount(0);
      })
      .catch((arg) => {
        setErrors(arg);
        setFailed(true);
      });
  };

  const fileText = useMemo(
    () => fileInputText(value, multiple, uploadedFileNames.current),
    [multiple, value]
  );

  return (
    <div>
      <div className="input-group">
        {fileText && <div className="input-file-label">{fileText}</div>}
        <Input
          key={`${path}-${clearCounter}`}
          id={path}
          innerRef={ref}
          type="file"
          name={path}
          disabled={uploadingCount > 0}
          multiple={multiple}
          onChange={handleFileChange}
          invalid={!!error}
          {...fieldProps}
          {...props}
        />
        {!required && value && <CloseButton onClick={handleClear} />}
      </div>
      {!!uploadingCount && (
        <div>
          <Progress
            className="mt-3"
            value={(uploadedFileIds.current.length / uploadingCount) * 100}
          />
        </div>
      )}
      {failed && (
        <DangerAlert
          title="Oops! Something went wrong, please try again"
          description={errors?.toString()}
        />
      )}
      {error && <p className="text-danger mt-1 small">{error?.message}</p>}
    </div>
  );
};

FieldFileBase.propTypes = {
  path: PropTypes.string.isRequired
};

export const FieldFile = (props) =>
  useGlobalComponent('FieldFile', FieldFileBase, props);
