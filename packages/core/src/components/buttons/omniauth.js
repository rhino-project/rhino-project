import { useMemo } from 'react';
import { OmniIconButton } from 'rhino/components/buttons';

import PropTypes from 'prop-types';
import { API_ROOT_PATH } from 'rhino/config';

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
  const endpoint = useMemo(() => {
    const url = new URL(`${API_ROOT_PATH}${providerPath}`);

    url.searchParams.append('auth_origin_url', window.location.href);

    return url;
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

export default OmniAuthButton;
