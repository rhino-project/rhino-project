import { Route } from 'react-router-dom';

import customRoutePaths from 'routes/custom';
import modelRoutePaths from './model';

import OrganizationSettingsPage from '../pages/settings/OrganizationSettingsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import { hasOrganizationsModule } from '../utils/models';
import {
  getAccountSettingsPath,
  getForgotPasswordPath,
  getSessionCreatePath,
  getSettingsPath,
  getUserCreatePath,
} from '../utils/routes';

export const routePaths = {
  ...modelRoutePaths,
  ...customRoutePaths,
  sessionCreate: getSessionCreatePath,
  userCreate: getUserCreatePath,
  userAccept: () => '/accept-invitation',
  settings: getSettingsPath,
  accountSettings: getAccountSettingsPath,
  forgotPassword: getForgotPasswordPath,
  resetPassword: () => '/reset-password',
  tokenExpired: () => '/reset-password/expired'
};

export const settingsRoute = () => {
  if (!hasOrganizationsModule()) return [];

  return [
    <Route
      key={routePaths.settings()}
      path={`${routePaths.settings()}/:activeTab?`}
      element={<OrganizationSettingsPage />}
    />
  ];
};

export const accountSettingsRoute = () => {
  return [
    <Route
      key={routePaths.settings()}
      path={`${routePaths.accountSettings()}/:activeTab?`}
      element={<SettingsPage />}
    />
  ];
};
