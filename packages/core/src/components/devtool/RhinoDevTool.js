import { useEffect, useState } from 'react';
import classnames from 'classnames';
import { omit } from 'lodash-es';

import RhinoLogo from './rhinoRedLogo.png';
import styles from './RhinoDevTool.module.css';
import { CloseButton } from '../buttons';
import { useLocalStorage } from 'react-use';
import env from '@rhino-project/config/env';
import { RHINO_DEV_BROADCAST_CHANNEL } from '../../hooks/dev';

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
        <button onClick={toggleCollapse} className={styles.toggleButton}>
          <img src={RhinoLogo} alt="Toggle" width="40" height="40" />
        </button>
      )}
      <div
        className={classnames(styles.rhinoTool, {
          [styles.collapsed]: isCollapsed
        })}
      >
        {!isCollapsed && (
          <div className={styles.content}>
            <div className="d-flex flex-row justify-content-between">
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
