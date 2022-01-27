import React from 'react';
import PropTypes from 'prop-types';

import BaseAuthedPage from 'rhino/pages/BaseAuthedPage';
import { MaxWidth } from 'rhino/components/layouts';

const ModelPage = ({ breadcrumb, children, loading }) => {
  return (
    <BaseAuthedPage loading={loading}>
      <MaxWidth>
        {breadcrumb}
        {children}
      </MaxWidth>
    </BaseAuthedPage>
  );
};

ModelPage.propTypes = {
  breadcrumb: PropTypes.node,
  children: PropTypes.node,
  loading: PropTypes.bool.isRequired
};

ModelPage.defaultProps = {
  loading: false
};

export default ModelPage;
