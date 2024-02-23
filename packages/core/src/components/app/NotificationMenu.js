import { NavLink } from 'react-router-dom';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';

import { NavIcon } from '../icons';
import { useNotifications, useNotificationsOpen, useNotificationsOpenAll } from '../../queries/notifications';

const NotificationMenu = () => {
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
    <UncontrolledDropdown nav direction="up">
      <DropdownToggle
        nav
        caret
        className="d-flex align-items-center text-light no-arrow"
      >
        <NavIcon icon="bell" extraClass="flex-shrink-0" />
        <span className="d-block ms-2 overflow-hidden flex-grow-1">
          Notifications
        </span>

        {hasNotifications && <Badge pill>{notifications?.count}</Badge>}
      </DropdownToggle>
      <DropdownMenu dark end>
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
