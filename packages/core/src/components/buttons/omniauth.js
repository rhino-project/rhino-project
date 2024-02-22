import { useMemo } from 'react';
import { OmniIconButton } from './';

import PropTypes from 'prop-types';
import { useRhinoConfig } from '@rhino-project/config';

const providerOverrides = {
  auth0: {
    name: 'Auth0',
    icon: 'door-open'
  },
  azure_oauth2: {
    name: 'Microsoft',
    icon: 'microsoft'
  },
  developer: {
    name: 'Developer',
    icon: 'code-square'
  },
  google_oauth2: {
    name: 'Google',
    icon: 'google'
  },
  github_oauth2: {
    name: 'GitHub',
    icon: 'github'
  }
};

const OmniAuthButton = ({ provider, providerPath, ...props }) => {
  const {
    env: { API_ROOT_PATH }
  } = useRhinoConfig();
  const endpoint = useMemo(() => {
    const url = new URL(`${API_ROOT_PATH}${providerPath}`);

    url.searchParams.append('auth_origin_url', window.location.href);

    return url;
  }, [API_ROOT_PATH, providerPath]);

  return (
    <OmniIconButton
      endpoint={endpoint.toString()}
      icon={provider}
      {...providerOverrides?.[provider]}
      {...props}
    />
  );
};

OmniAuthButton.propTypes = {
  provider: PropTypes.string.isRequired,
  providerPath: PropTypes.string.isRequired
};

export default OmniAuthButton;
