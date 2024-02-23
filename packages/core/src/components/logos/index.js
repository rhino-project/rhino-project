import React from 'react';

import darkLogoSource from 'assets/images/logo-dark.svg';
import lightLogoSource from 'assets/images/logo-light.svg';

export const DarkLogo = (props) => (
  <img alt="Dark Logo" src={darkLogoSource} {...props} />
);
export const LightLogo = (props) => (
  <img alt="Light Logo" src={lightLogoSource} {...props} />
);

export const SplashScreen = () => {
  return <></>;
};
