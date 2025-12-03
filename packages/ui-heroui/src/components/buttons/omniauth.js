import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { OmniIconButton } from './index';

const providerOverrides = {
  auth0: {
    name: 'Auth0',
    icon: 'mdi:door-open'
  },
  azure_oauth2: {
    name: 'Microsoft',
    icon: 'mdi:microsoft'
  },
  developer: {
    name: 'Developer',
    icon: 'mdi:code-square'
  },
  google_oauth2: {
    name: 'Google',
    icon: 'mdi:google'
  },
  github_oauth2: {
    name: 'GitHub',
    icon: 'mdi:github'
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
