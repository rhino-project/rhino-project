import { createContext } from 'react';
import { ModelContext } from './ModelProvider';
import { useRhinoDevBroadcastSend } from '../../hooks/dev';

export const ModelIndexContext = createContext();

const include = [
  'model',
  'parentId',
  'defaultState',
  'initialState',
  'order',
  'search',
  'filter',
  'totalFilters',
  'fullFilter',
  'totalFullFilters',
  'setDefaultFilter',
  'limit',
  'setLimit',
  'offset',
  'totalPages',
  'page',
  'hasPrevPage',
  'hasNextPage',
  'firstPage',
  'lastPage',
  'total'
];

export const ModelIndexProvider = ({ children, ...props }) => {
  const { model } = props;

  useRhinoDevBroadcastSend(
    {
      type: 'ModelIndexContext',
      context: props
    },
    { include }
  );

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelIndexContext.Provider value={{ ...props }}>
        {children}
      </ModelIndexContext.Provider>
    </ModelContext.Provider>
  );
};
