import { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Alert, CustomInput, Progress } from 'reactstrap';

import Uploader from 'rhino/utils/uploader';
import { CloseButton } from 'rhino/components/buttons';
import { useForceUpdate } from 'rhino/hooks/util';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';
import { useController } from 'react-hook-form';

const fileInputText = (value, multiple, uploadedFileNames) => {
  if (!multiple && typeof value === 'string') return uploadedFileNames[value];

  if (!multiple) return value?.display_name;

  if (!value || value.length === 0) return 'Choose files';

  return `${value?.length} files`;
};

export const ModelFieldFileBase = ({ model, multiple, path }) => {
  const {
    field: { ref, value, onChange, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [failed, setFailed] = useState(false);
  const [errors, setErrors] = useState(null);
  const [clearCounter, setClearCounter] = useState(0);
  const forceUpdate = useForceUpdate();
  const uploadedFileIds = useRef([]);
  const uploadedFileNames = useRef({});

  const handleClear = () => {
    // Hack to reset the file input because CustomInput doesn't get an
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
    <>
      <div className="d-flex flex-row">
        <CustomInput
          key={`${path}-${clearCounter}`}
          id={path}
          innerRef={ref}
          label={fileText}
          type="file"
          name={path}
          disabled={uploadingCount > 0}
          multiple={multiple}
          onChange={handleFileChange}
          {...fieldProps}
        />
        {!attribute.required && value && (
          <CloseButton className="ml-2" onClick={handleClear} />
        )}
      </div>
      {!!uploadingCount && (
        <div>
          <Progress
            className="mt-3"
            value={(uploadedFileIds.current.length / uploadingCount) * 100}
            indicating
          />
        </div>
      )}
      {failed && (
        <Alert color="danger">
          <h6>Oops! Something went wrong, please try again.</h6>
          <p>{errors?.toString()}</p>
        </Alert>
      )}
      {error && <Alert color="danger">{error}</Alert>}
    </>
  );
};

ModelFieldFileBase.propTypes = {
  path: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.string
};

ModelFieldFileBase.defaultProps = {
  multiple: false
};

const defaultComponents = { ModelFieldField: ModelFieldFileBase };

const ModelFieldField = ({ overrides, ...props }) => {
  const { ModelFieldField } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldField {...props} />;
};

ModelFieldField.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldField;
