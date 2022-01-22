import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { get, filter } from 'lodash';

import { useOverrides } from 'rhino/hooks/overrides';
import { getAttributeFromPath } from 'rhino/utils/models';
import { getStringForDisplay, useModelClassNames } from 'rhino/utils/ui';
import { usePaths } from 'rhino/hooks/paths';

const getViewablePaths = (model) =>
  filter(model.properties, (a) => {
    return (
      a.type !== 'identifier' &&
      a.name !== model.ownedBy &&
      !(a.type === 'array' && a.readOnly)
    );
  }).map((a) => {
    // FIXME hardcoded _attachment
    // We want attachments to be a link
    if (a.name.endsWith('_attachment')) return a.name;

    return a.type === 'reference' ? `${a.name}.display_name` : a.name;
  });

const ModelShowAttribute = ({ model, attribute, path, resource }) => {
  const modelClassNames = useModelClassNames(
    'show-attribute',
    model,
    attribute
  );

  const displayString = getStringForDisplay(attribute, get(resource, path));

  return (
    <div className={modelClassNames}>
      <FormGroup>
        <Label>{attribute.readableName}</Label>
        {React.isValidElement(displayString) ? (
          <div>{displayString}</div>
        ) : (
          <Input readOnly value={displayString} />
        )}
      </FormGroup>
    </div>
  );
};

ModelShowAttribute.propTypes = {
  attribute: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired
};

const defaultComponents = {
  ModelShowAttribute
};

const ModelShowDescription = ({ overrides, ...props }) => {
  const { model, paths, resource } = props;
  const { ModelShowAttribute } = useOverrides(defaultComponents, overrides);
  const modelClassNames = useModelClassNames('show-description', model);

  const pathsOrDefault = useMemo(() => paths || getViewablePaths(model), [
    paths,
    model
  ]);
  const computedPaths = usePaths(pathsOrDefault, resource);

  const displayAttributes = useMemo(
    () =>
      computedPaths.map((p) => ({
        path: p,
        attribute: getAttributeFromPath(model, p)
      })),
    [computedPaths, model]
  );

  return (
    <div className={modelClassNames}>
      <Form>
        {resource &&
          displayAttributes.map(({ path, attribute }) => (
            <ModelShowAttribute
              key={attribute.name}
              model={model}
              path={path}
              resource={resource}
              attribute={attribute}
            />
          ))}
      </Form>
    </div>
  );
};

ModelShowDescription.propTypes = {
  model: PropTypes.object.isRequired,
  paths: PropTypes.array,
  overrides: PropTypes.object,
  resource: PropTypes.object
};

export default ModelShowDescription;
