import { Route } from 'react-router-dom';

import DashboardPage from '../pages/DashboardPage';
import { getRootPath } from '@rhino-project/core/utils';

// A list of paths customized for this app
const customRoutePaths = {
  rootpath: getRootPath
};

export const customRoutes = () => {
  return [
    <Route key={customRoutePaths.rootpath} index element={<DashboardPage />} />
  ];
};

export default customRoutePaths;
