import { createConsumer } from '@rails/actioncable';
import { useMemo } from 'react';

const CABLE_PATH = '/cable';

export const useCable = () => {
  const consumer = useMemo(() => createConsumer(CABLE_PATH), []);

  return consumer;
};
