import PropTypes from 'prop-types';

import BaseAuthedPage from '../BaseAuthedPage';
import { MaxWidth } from '../../components/layouts';

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
