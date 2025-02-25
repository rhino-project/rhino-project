import { Icon } from '@iconify/react';
import {
  useNotifications,
  useNotificationsOpen,
  useNotificationsOpenAll
} from '@rhino-project/core/queries';
import {
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger
} from '@heroui/react';

export const NotificationMenu = () => {
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
    <Dropdown>
      <DropdownTrigger>
        <div className="flex flex-row items-center gap-4 p-2">
          <Badge
            color="primary"
            content={notifications?.count}
            isInvisible={!hasNotifications}
            size="md"
          >
            <Icon className="size-4" icon="bi:bell" />
          </Badge>
          <span>Notifications</span>
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        {notifications?.notifications?.map((n) => {
          return (
            <DropdownItem
              key={n.id}
              href={n.notifiable_path}
              onPress={() => handleItemClick(n.id)}
            >
              {n.printable_notifiable_name}
            </DropdownItem>
          );
        })}
        {hasNotifications ? (
          <>
            <DropdownSection showDivider />
            <DropdownItem disabled={!hasNotifications} onPress={handleClick}>
              Mark All Opened
            </DropdownItem>
          </>
        ) : (
          <DropdownItem disabled>
            <em>No unread notifications</em>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};
