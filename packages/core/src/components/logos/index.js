import React from 'react';

import { useRhinoAsset, useRhinoConfig } from '@rhino-project/config';

export const DarkLogo = (props) => {
  const { darkLogo } = useRhinoConfig();
  const darkLogoSource = useRhinoAsset(darkLogo);

  return <img alt="Dark Logo" src={darkLogoSource} {...props} />;
};

export const LightLogo = (props) => {
  const { lightLogo } = useRhinoConfig();
  const lightLogoSource = useRhinoAsset(lightLogo);

  return <img alt="Light Logo" src={lightLogoSource} {...props} />;
};

export const SplashScreen = () => {
  return <></>;
};
