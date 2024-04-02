import { omit, pick } from 'lodash-es';
import { useEffect, useId, useMemo } from 'react';
import env from '@rhino-project/config/env';
import { useUnmount } from 'react-use';

export const RHINO_DEV_BROADCAST_CHANNEL = 'rhino_dev_channel';

export type RhinoDevBroadcastSendMessageContext = null | object;

export type RhinoDevBroadcastSendMessage = {
  type: string;
  context: RhinoDevBroadcastSendMessageContext;
};

export type RhinoDevBroadcastSendMessageOptions = {
  include?: string[];
  exclude?: string[];
};

const reducedContext = (
  context: null | object,
  options: RhinoDevBroadcastSendMessageOptions
) => {
  let reducedContext = context;
  if (options?.include) reducedContext = pick(reducedContext, options.include);
  if (options?.exclude) reducedContext = omit(reducedContext, options.exclude);

  return reducedContext;
};

const postMessage = (
  bc: BroadcastChannel | null,
  id: string,
  message: RhinoDevBroadcastSendMessage,
  action: string,
  options: RhinoDevBroadcastSendMessageOptions
) => {
  const { context, ...rest } = message;
  const slimContext = reducedContext(context, options);

  if (!bc) return;

  bc.postMessage({
    action,
    id,
    ...rest,
    context: JSON.stringify(slimContext, null, 2)
  });
};

export const useRhinoDevBroadcastSend = (
  message: RhinoDevBroadcastSendMessage,
  options: RhinoDevBroadcastSendMessageOptions
): void => {
  const id = useId();
  const bc = useMemo(
    () => (env.DEV ? new BroadcastChannel(RHINO_DEV_BROADCAST_CHANNEL) : null),
    []
  );

  useEffect(
    () => postMessage(bc, id, message, 'update', options),
    [bc, id, message, options]
  );

  useUnmount(() => postMessage(bc, id, message, 'remove', options));
};
