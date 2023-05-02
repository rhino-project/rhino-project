import React from 'react';
import {
  Badge,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import {
  useNotifications,
  useNotificationsOpenAll,
  useNotificationsOpen
} from 'rhino/queries/notifications';
import { NavIcon } from 'rhino/components/icons';

const NotificationMenu = ({ sidebarMode = false }) => {
  const { data: { data: notifications } = {}, refetch } = useNotifications();
  const { mutate: openAll } = useNotificationsOpenAll();
  const { mutate: openOne } = useNotificationsOpen();
  const hasNotifications = notifications?.count > 0;

  const handleItemClick = (notificationId) =>
    openOne(notificationId, {
      onSuccess: () => refetch()
    });
  const handleClick = () => openAll({ onSuccess: () => refetch() });

  return (
    <UncontrolledDropdown nav inNavbar direction={sidebarMode ? 'up' : 'down'}>
      <DropdownToggle nav caret className="d-flex align-items-center">
        <NavIcon icon="bell" extraClass="flex-shrink-0" />
        <span
          className={classnames('d-block', 'overflow-hidden', 'flex-grow-1', {
            'd-md-none': !sidebarMode
          })}
        >
          Notifications
        </span>

        {hasNotifications && <Badge>{notifications?.count}</Badge>}
      </DropdownToggle>
      <DropdownMenu end={sidebarMode ? false : true}>
        {notifications?.notifications?.map((n) => {
          return (
            <DropdownItem
              key={n.id}
              tag={NavLink}
              to={n.notifiable_path}
              onClick={() => handleItemClick(n.id)}
            >
              {n.printable_notifiable_name}
            </DropdownItem>
          );
        })}
        {hasNotifications ? (
          <>
            <DropdownItem divider />
            <DropdownItem disabled={!hasNotifications} onClick={handleClick}>
              Mark All Opened
            </DropdownItem>
          </>
        ) : (
          <DropdownItem disabled>
            <em>No unread notifications</em>
          </DropdownItem>
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default NotificationMenu;

NotificationMenu.propTypes = {
  sidebarMode: PropTypes.bool
};
