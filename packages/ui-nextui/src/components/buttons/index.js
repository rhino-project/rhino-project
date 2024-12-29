import PropTypes from 'prop-types';
import { useState } from 'react';

import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';

export const IconButton = ({ icon, ...props }) => (
  <Button {...props} startContent={<Icon className="w-8" icon={icon} />} />
);

export const OmniIconButton = ({ icon, endpoint, ...props }) => {
  const [loading, setLoading] = useState(false);

  return (
    <form method="post" action={endpoint} onSubmit={() => setLoading(true)}>
      <div className="omni-icon-btn">
        <Button
          className="omni-icon-btn__icon"
          {...props}
          type="submit"
          isLoading={loading}
        >
          <Icon style={{ height: '1rem', width: '1rem' }} icon={icon} />
        </Button>
      </div>
    </form>
  );
};

OmniIconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired
};

export const SubmitButton = (props) => (
  <Button color="primary" type="submit" {...props} />
);

export const LinkButton = (props) => <Button as={Link} {...props} />;

export const CloseButton = (props) => (
  <Button isIconOnly {...props}>
    <Icon icon="bi:x" />
  </Button>
);
