import PropTypes from 'prop-types';

import BaseAuthedPage from 'rhino/pages/BaseAuthedPage';
import { MaxWidth } from 'rhino/components/layouts';

const ModelPage = ({ children, ...props }) => {
  return (
    <BaseAuthedPage {...props}>
      <MaxWidth>{children}</MaxWidth>
    </BaseAuthedPage>
  );
};

ModelPage.propTypes = {
  children: PropTypes.node
};

export default ModelPage;
