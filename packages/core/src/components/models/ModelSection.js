import React from 'react';
import PropTypes from 'prop-types';

import { useModelClassNames } from 'rhino/utils/ui';
import { useModelContext } from 'rhino/hooks/controllers';

const ModelSection = (props) => {
  const { baseClassName, children } = props;
  const { model } = useModelContext();
  const modelClassNames = useModelClassNames(baseClassName, model);

  return <div className={modelClassNames}>{children}</div>;
};

ModelSection.propTypes = {
  baseClassName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default ModelSection;
