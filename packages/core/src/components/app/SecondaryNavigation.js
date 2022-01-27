import React, { useMemo } from 'react';
import { PropTypes } from 'prop-types';

import { hasNotificationsModule } from 'rhino/utils/models';
import CustomSecondaryNavigation from 'components/app/CustomSecondaryNavigation';
import AccountMenu from './AccountMenu';
import NotificationMenu from './NotificationMenu';
import BaseOwnerSwitcher from './BaseOwnerSwitcher';

const SecondaryNavigation = ({ className, sidebarMode = false }) => {
  const showNotifications = useMemo(() => hasNotificationsModule(), []);

  return (
    <div className={className}>
      <CustomSecondaryNavigation />
      <BaseOwnerSwitcher sidebarMode={sidebarMode} />
      {showNotifications && <NotificationMenu sidebarMode={sidebarMode} />}
      <AccountMenu sidebarMode={sidebarMode} />
    </div>
  );
};

export default SecondaryNavigation;

SecondaryNavigation.propTypes = {
  className: PropTypes.string,
  sidebarMode: PropTypes.bool
};
