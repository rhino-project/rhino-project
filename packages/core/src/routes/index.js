import { Route } from 'react-router-dom';

import customRoutePaths from 'routes/custom';
import modelRoutePaths from './model';

import {
  AcceptInvitationPage,
  ForgotPasswordPage,
  ResetPasswordExpiredPage,
  ResetPasswordPage,
  SignInPage,
  SignUpPage
} from 'rhino/pages/auth';
import OrganizationSettingsPage from 'rhino/pages/settings/OrganizationSettingsPage';
import SettingsPage from 'rhino/pages/settings/SettingsPage';
import { hasOrganizationsModule } from 'rhino/utils/models';
import {
  getAccountSettingsPath,
  getForgotPasswordPath,
  getSessionCreatePath,
  getSettingsPath,
  getUserCreatePath
} from 'rhino/utils/routes';

const routePaths = {
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

export const authRoutes = () => {
  return [
    <Route
      key={routePaths.sessionCreate()}
      path={routePaths.sessionCreate()}
      element={<SignInPage />}
      index
    />,
    <Route
      key={routePaths.userCreate()}
      path={routePaths.userCreate()}
      element={<SignUpPage />}
    />,
    <Route
      key={routePaths.userAccept()}
      path={routePaths.userAccept()}
      element={<AcceptInvitationPage />}
    />,
    <Route
      key={routePaths.forgotPassword()}
      path={routePaths.forgotPassword()}
      element={<ForgotPasswordPage />}
    />,
    <Route
      key={routePaths.resetPassword()}
      path={routePaths.resetPassword()}
      element={<ResetPasswordPage />}
    />,
    <Route
      key={routePaths.tokenExpired()}
      path={routePaths.tokenExpired()}
      element={<ResetPasswordExpiredPage />}
    />
  ];
};

export default routePaths;
