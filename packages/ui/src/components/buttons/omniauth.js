import { useMemo } from 'react';
import { OmniIconButton } from './';

import PropTypes from 'prop-types';

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

export const OmniAuthButton = ({ provider, providerPath, ...props }) => {
  const endpoint = useMemo(() => {
    const url = new URLSearchParams();

    url.append('resource_class', 'User');
    url.append('auth_origin_url', window.location.href);

    return `${providerPath}?${url.toString()}`;
  }, [providerPath]);

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
