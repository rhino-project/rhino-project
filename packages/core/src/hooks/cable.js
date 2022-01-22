import { createConsumer } from '@rails/actioncable';
import env from 'config';
import { useMemo } from 'react';

const CABLE_PATH = `${env.REACT_APP_API_ROOT_PATH}/cable`;

export const useCable = () => {
  const consumer = useMemo(() => createConsumer(CABLE_PATH), []);

  return consumer;
};
