import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { customRoutes } from 'routes/custom';
import NotFoundPage from 'rhino/components/shared/NotFoundPage';
import { ENABLE_MODEL_ROUTES } from 'config';
import { accountSettingsRoute, settingsRoute } from '../../routes';
import { modelRoutes } from '../../routes/model';

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
