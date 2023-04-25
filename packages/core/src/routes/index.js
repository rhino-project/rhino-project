import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import modelRoutePaths, { modelRoutes } from './model';
import customRoutePaths, { customRoutes } from 'routes/custom';
import NotFoundPage from 'rhino/components/shared/NotFoundPage';
import { ENABLE_MODEL_ROUTES } from 'config';

import {
  ForgotPasswordPage,
  ResetPasswordExpiredPage,
  ResetPasswordPage,
  SignInPage,
  SignUpPage,
  AcceptInvitationPage
} from 'rhino/pages/auth';
import SettingsPage from 'rhino/pages/settings/SettingsPage';
import OrganizationSettingsPage from 'rhino/pages/settings/OrganizationSettingsPage';
import NonAuthenticatedRoute from './NonAuthenticatedRoute';
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

export const settingsRoute = (match) => {
  if (!hasOrganizationsModule()) return [];

  return [
    <Route
      key={routePaths.settings()}
      path={`${match.path}${routePaths.settings()}/:activeTab?`}
      component={OrganizationSettingsPage}
    />
  ];
};

export const accountSettingsRoute = (match) => {
  return [
    <Route
      key={routePaths.settings()}
      exact
      path={`${match.path}${routePaths.accountSettings()}/:activeTab?`}
      component={SettingsPage}
    />
  ];
};

export const AppRoutes = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      {accountSettingsRoute(match)}
      {settingsRoute(match)}
      {customRoutes(match)}
      {ENABLE_MODEL_ROUTES ? modelRoutes(match) : []}
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export const authRoutes = () => {
  return [
    <NonAuthenticatedRoute
      key={routePaths.sessionCreate()}
      exact
      path={routePaths.sessionCreate()}
    >
      <SignInPage />
    </NonAuthenticatedRoute>,
    <NonAuthenticatedRoute
      key={routePaths.userCreate()}
      exact
      path={routePaths.userCreate()}
    >
      <SignUpPage />
    </NonAuthenticatedRoute>,
    <NonAuthenticatedRoute
      key={routePaths.userAccept()}
      exact
      path={routePaths.userAccept()}
    >
      <AcceptInvitationPage />
    </NonAuthenticatedRoute>,
    <NonAuthenticatedRoute
      key={routePaths.forgotPassword()}
      exact
      path={routePaths.forgotPassword()}
    >
      <ForgotPasswordPage />
    </NonAuthenticatedRoute>,
    <NonAuthenticatedRoute
      key={routePaths.resetPassword()}
      exact
      path={routePaths.resetPassword()}
    >
      <ResetPasswordPage />
    </NonAuthenticatedRoute>,
    <NonAuthenticatedRoute
      key={routePaths.tokenExpired()}
      exact
      path={routePaths.tokenExpired()}
    >
      <ResetPasswordExpiredPage />
    </NonAuthenticatedRoute>
  ];
};

export default routePaths;
