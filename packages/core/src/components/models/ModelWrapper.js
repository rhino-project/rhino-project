import React from 'react';
import PropTypes from 'prop-types';

import { useModelClassNames } from 'rhino/utils/ui';

const ModelWrapper = (props) => {
  const { baseClassName, model, wrapper, children } = props;
  const modelClassNames = useModelClassNames(baseClassName, model);

  if (wrapper) {
    return wrapper(props);
  }

  return <div className={modelClassNames}>{children}</div>;
};

ModelWrapper.propTypes = {
  baseClassName: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  wrapper: PropTypes.func
};

export default ModelWrapper;
