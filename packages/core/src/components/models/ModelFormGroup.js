import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import classnames from 'classnames';
import { Col, FormFeedback, FormGroup, Label } from 'reactstrap';

import ModelFormField from './ModelFormField';

const extractError = (errors, path) => get(errors, `${path}[0]`);

const ModelFormLabel = ({ attribute, path, ...props }) => (
  <Label
    className={classnames({
      required: attribute['x-rhino-required']
    })}
    for={path}
    checked
    {...props}
  >
    {attribute.readableName}
  </Label>
);

ModelFormLabel.propTypes = {
  attribute: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFormGroupVertical = (props) => {
  const { attribute, errors, path, key } = props;
  const error = extractError(errors, path);

  return (
    <FormGroup key={key}>
      <ModelFormLabel attribute={attribute} path={path} />
      <ModelFormField {...props} />
      {error && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
};

ModelFormGroupVertical.propTypes = {
  attribute: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  errors: PropTypes.object
};

export const ModelFormGroupHorizontal = (props) => {
  const { attribute, errors, path } = props;
  const error = useMemo(() => extractError(errors, path), [errors, path]);

  return (
    <FormGroup row>
      <ModelFormLabel attribute={attribute} path={path} sm={2} />
      <Col>
        <ModelFormField {...props} />
        {error && <FormFeedback>{error}</FormFeedback>}
      </Col>
    </FormGroup>
  );
};

ModelFormGroupHorizontal.propTypes = {
  attribute: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  errors: PropTypes.object
};

const ModelFormGroup = ModelFormGroupVertical;

export default ModelFormGroup;
