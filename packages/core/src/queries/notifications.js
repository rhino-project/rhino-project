import { useQuery, useMutation } from '@tanstack/react-query';

import { networkApiCall } from '../lib/networking';
import { useUserId } from '../hooks/auth';

const basePath = (userId) => `api/users/${userId}/notifications`;
const fullPath = (userId, queryPath) => `${basePath(userId)}/${queryPath}`;

export const useNotifications = () => {
  const userId = useUserId();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['notifications-index'],
    queryFn: ({ signal }) =>
      networkApiCall(fullPath(userId, '?filter=unopened&limit=10'), { signal }),
    enabled: !!userId
  });
};

export const useNotificationsOpenAll = () => {
  const userId = useUserId();

  return useMutation({
    mutationFn: () =>
      networkApiCall(fullPath(userId, 'open_all'), { method: 'post' })
  });
};

export const useNotificationsOpen = () => {
  const userId = useUserId();

  return useMutation({
    mutationFn: (notificationId) =>
      networkApiCall(fullPath(userId, `${notificationId}/open`), {
        method: 'put'
      })
  });
};
