import { PropTypes } from 'prop-types';
import { useMemo } from 'react';

import CustomSecondaryNavigation from 'components/app/CustomSecondaryNavigation';
import { hasNotificationsModule } from 'rhino/utils/models';
import AccountMenu from './AccountMenu';
import BaseOwnerSwitcher from './BaseOwnerSwitcher';
import NotificationMenu from './NotificationMenu';

const SecondaryNavigation = ({ className }) => {
  const showNotifications = useMemo(() => hasNotificationsModule(), []);

  return (
    <div className={className}>
      <CustomSecondaryNavigation />
      {showNotifications && (
        <>
          <NotificationMenu />
          <hr className="border-top border-gray-700" />
        </>
      )}
      <BaseOwnerSwitcher />
      <AccountMenu />
    </div>
  );
};

export default SecondaryNavigation;

SecondaryNavigation.propTypes = {
  className: PropTypes.string
};
