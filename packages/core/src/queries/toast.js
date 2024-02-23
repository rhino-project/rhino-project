import { useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

const TOAST_KEY = ['toast'];

export class toastStore {
  static toasts = {};
  static queryClient = null;

  static add = (message) => {
    this.toasts[uuidv4()] = message;

    this.queryClient.refetchQueries(TOAST_KEY);
  };

  static remove = (id) => {
    delete this.toasts[id];

    this.queryClient.refetchQueries(TOAST_KEY);
  };
}

export const useToast = () => {
  toastStore.queryClient = useQueryClient();

  const addToast = () => {
    toastStore.add();
  };

  const removeToast = (id) => {
    toastStore.remove(id);
  };

  return [
    useQuery({ queryKey: TOAST_KEY, queryFn: () => toastStore.toasts }),
    addToast,
    removeToast
  ];
};
