import PropTypes from 'prop-types';

import env from 'config';
import { OmniIconButton } from 'rhino/components/buttons';

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

const providerPath = (provider) =>
  `${env.AUTH_ROOT_PATH}/${provider}?auth_origin_url=${window.location.href}`;

const OmniAuthButton = ({ provider, loading, handleAuth, ...props }) => (
  <OmniIconButton
    href={providerPath(provider)}
    onClick={() => handleAuth(provider)}
    icon={!loading && provider}
    loading={loading === provider}
    {...providerOverrides?.[provider]}
    {...props}
  />
);

OmniAuthButton.propTypes = {
  provider: PropTypes.string.isRequired,
  loading: PropTypes.string.isRequired,
  handleAuth: PropTypes.func.isRequired
};

export default OmniAuthButton;
