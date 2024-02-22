import PropTypes from 'prop-types';

import BaseAuthedPage from '../BaseAuthedPage';
import { MaxWidth } from '../../components/layouts';

export const ModelPage = ({ children, ...props }) => {
  return (
    <BaseAuthedPage {...props}>
      <MaxWidth>{children}</MaxWidth>
    </BaseAuthedPage>
  );
};

ModelPage.propTypes = {
  children: PropTypes.node
};
