import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';

import env from 'config';
import { LinkIconButton } from 'rhino/components/buttons';

const providerOverrides = {
  google_oauth2: {
    name: 'Google',
    icon: 'google'
  },
  azure_oauth2: {
    name: 'Microsoft',
    icon: 'microsoft'
  }
};

const providerPath = (provider) =>
  `${env.AUTH_ROOT_PATH}/${provider}?auth_origin_url=${window.location.href}`;

const OmniAuthButton = ({ provider, loading, handleAuth, ...props }) => (
  <LinkIconButton
    href={providerPath(provider)}
    onClick={() => handleAuth(provider)}
    icon={!loading && provider}
    loading={loading === provider}
    {...providerOverrides?.[provider]}
    block
    {...props}
  >
    {providerOverrides?.[provider]?.name || capitalize(provider)}
  </LinkIconButton>
);

OmniAuthButton.propTypes = {
  provider: PropTypes.string.isRequired,
  loading: PropTypes.string.isRequired,
  handleAuth: PropTypes.func.isRequired
};

export default OmniAuthButton;
