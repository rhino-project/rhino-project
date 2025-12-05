import { useEffect, useState } from 'react';
import { omit } from 'lodash-es';

import RhinoLogo from './rhinoRedLogo.png';
import { CloseButton } from '../buttons';
import { useLocalStorage } from 'react-use';
import env from '@rhino-project/core/config/env';
import { RHINO_DEV_BROADCAST_CHANNEL } from '@rhino-project/core/hooks';
import { cn } from '@heroui/react';

const ContextDetails = ({ context: { id, type, context } }) => {
  const model = JSON.parse(context)?.model;

  return (
    <div>
      {model && (
        <details>
          <summary>Model: {model.readableName}</summary>
          <pre>
            {JSON.stringify(
              model,
              // These are hoisted to the top of the model object
              (key, value) =>
                ['x-rhino-attribute', 'x-rhino-model'].includes(key)
                  ? undefined
                  : value,
              2
            )}
          </pre>
        </details>
      )}
      <details>
        <summary>
          Context: {type} ({id})
        </summary>
        <pre>{context}</pre>
      </details>
    </div>
  );
};

export const RhinoDevTool = () => {
  const [isCollapsed, setIsCollapsed] = useLocalStorage('rhinoDevTool', true);
  const [contexts, setContexts] = useState({});

  useEffect(() => {
    const bc = new BroadcastChannel(RHINO_DEV_BROADCAST_CHANNEL);

    bc.onmessage = ({ data }) => {
      const { id, action } = data;

      setContexts((current) => {
        if (action === 'remove') {
          return omit(current, [id]);
        }

        return {
          ...current,
          [id]: data
        };
      });
    };

    // Close on unmount
    return () => bc.close();
  }, []);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="absolute top-2.5 right-2.5 bg-transparent border-none cursor-pointer p-0 z-[9999]"
        >
          <img src={RhinoLogo} alt="Toggle" width="40" height="40" />
        </button>
      )}
      <div
        className={cn(
          'fixed right-0 top-0 w-[300px] h-screen overflow-auto bg-white border border-gray-300 shadow-md p-2.5 z-[9999]',
          {
            'hidden overflow-hidden': isCollapsed
          }
        )}
      >
        {!isCollapsed && (
          <div>
            <div className="flex flex-row justify-between">
              <h5>Rhino</h5>
              <CloseButton onClick={toggleCollapse} />
            </div>
            <details>
              <summary>Env</summary>
              <pre>{JSON.stringify(env, null, 2)}</pre>
            </details>

            {Object.keys(contexts).map((id) => (
              <ContextDetails key={id} context={contexts[id]} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
