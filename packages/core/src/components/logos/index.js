import React, { useEffect, useState } from 'react';

import { useRhinoAsset, useRhinoConfig } from '@rhino-project/config';

export const ThemedLogo = () => {
  // State to track the current theme
  const [theme, setTheme] = useState('light');

  // Effect to check the theme and update state accordingly
  useEffect(() => {
    // Function to get the current theme from the body attribute
    const getTheme = () =>
      document.documentElement.getAttribute('data-bs-theme');

    // Set the theme on initial load
    setTheme(getTheme());

    // Create a mutation observer to watch for changes in the data-bs-theme attribute
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });

    // Observe changes to the body's attributes
    observer.observe(document.body, { attributes: true });

    // Cleanup observer when component unmounts
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Show dark logo if theme is light, light logo if theme is dark */}
      {theme === 'light' ? <DarkLogo /> : <LightLogo />}
    </div>
  );
};

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
