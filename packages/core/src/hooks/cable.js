import { createConsumer } from '@rails/actioncable';
import { useMemo } from 'react';
import { API_ROOT_PATH } from 'rhino/config';

const CABLE_PATH = `${API_ROOT_PATH}/cable`;

export const useCable = () => {
  const consumer = useMemo(() => createConsumer(CABLE_PATH), []);

  return consumer;
};
