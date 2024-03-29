import { useContext } from 'react';
import classnames from 'classnames';

import RhinoLogo from './rhinoRedLogo.png';
import styles from './RhinoDevTool.module.css';
import { CloseButton } from '../buttons';
import { useModelContext } from '../../hooks/models';
import { ModelIndexContext } from '../models/ModelIndexProvider';
import { ModelShowContext } from '../models/ModelShowProvider';
import { ModelEditContext } from '../models/ModelEditProvider';
import { ModelCreateContext } from '../models/ModelCreateProvider';
import { useLocalStorage } from 'react-use';
import { pick } from 'lodash-es';
import env from '@rhino-project/config/env';

const RhinoDevToolModelIndex = () => {
  const context = useContext(ModelIndexContext);

  if (!context) return null;

  return (
    <details>
      <summary>Context: Index</summary>
      <pre>
        {JSON.stringify(
          pick(context, [
            'parentId',
            'defaultState',
            'initialState',
            'order',
            'setOrder',
            'search',
            'setSearch',
            'filter',
            'setFilter',
            'totalFilters',
            'fullFilter',
            'totalFullFilters',
            'setDefaultFilter',
            'limit',
            'setLimit',
            'offset',
            'setOffset',
            'totalPages',
            'page',
            'hasPrevPage',
            'hasNextPage',
            'firstPage',
            'lastPage',
            'setPage'
          ]),
          null,
          2
        )}
      </pre>
    </details>
  );
};

const RhinoDevToolModelShow = () => {
  const context = useContext(ModelShowContext);

  if (!context) return null;

  return (
    <details>
      <summary>Context: Show</summary>
      <pre>{JSON.stringify(pick(context, ['modelId', 'paths']), null, 2)}</pre>
    </details>
  );
};

const RhinoDevToolModelCreate = () => {
  const context = useContext(ModelCreateContext);

  if (!context) return null;

  return (
    <details>
      <summary>Context: Create</summary>
      <pre>{JSON.stringify(pick(context, ['parentId', 'paths']), null, 2)}</pre>
    </details>
  );
};

const RhinoDevToolModelEdit = () => {
  const context = useContext(ModelEditContext);

  if (!context) return null;

  return (
    <details>
      <summary>Context: Edit</summary>
      <pre>{JSON.stringify(pick(context, ['modelId', 'paths']), null, 2)}</pre>
    </details>
  );
};

export const RhinoDevTool = () => {
  const { model } = useModelContext();
  const [isCollapsed, setIsCollapsed] = useLocalStorage('rhinoDevTool', true);

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
            <RhinoDevToolModelShow />
            <RhinoDevToolModelIndex />
            <RhinoDevToolModelCreate />
            <RhinoDevToolModelEdit />
          </div>
        )}
      </div>
    </>
  );
};
