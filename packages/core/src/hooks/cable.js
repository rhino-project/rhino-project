import { createConsumer } from '@rails/actioncable';
import { useMemo } from 'react';
import env from '../config/env';

const CABLE_PATH = `${env.API_ROOT_PATH}/cable`;

export const useCable = () => {
  const consumer = useMemo(() => createConsumer(CABLE_PATH), []);

  return consumer;
};
