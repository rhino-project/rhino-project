import ModelFormGroup from 'rhino/components/models/ModelFormGroup';
import { usePaths } from 'rhino/hooks/paths';
import { isFunction, isPlainObject, isString } from 'lodash';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Form } from 'reactstrap';
import { getAttributeFromPath } from 'rhino/utils/models';

const ModelForm = ({ errors, model, paths, resource, onChange }) => {
  const finalPaths = usePaths(paths, resource);
  const computedAttributes = useMemo(
    () =>
      finalPaths.map((p) => {
        if (isPlainObject(p)) {
          return p;
        } else if (isString(p)) {
          return {
            path: p,
            renderer: ModelFormGroup,
            attribute: getAttributeFromPath(model, p)
          };
        } else if (isFunction(p)) {
          return { path: p, renderer: p };
        }

        throw new Error(
          `A path can only be a string, an object or a function, but got ${typeof p}`
        );
      }),
    [finalPaths, model]
  );

  return (
    <Form>
      {computedAttributes.map(({ attribute, renderer, path }, idx) => {
        return renderer({
          key: path,
          autoFocus: idx === 0,
          attribute,
          path,
          errors,
          resource,
          values: resource,
          onChange
        });
      })}
    </Form>
  );
};

ModelForm.propTypes = {
  model: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  paths: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
  onChange: PropTypes.func,
  errors: PropTypes.object
};

export default ModelForm;
