import { createContext } from 'react';
import { FormProvider } from '../forms/FormProvider';
import { ModelContext } from './ModelProvider';
import { useRhinoDevBroadcastSend } from '../../hooks/dev';

export const ModelShowContext = createContext();

export const ModelShowProvider = ({ children, ...props }) => {
  const { methods, ...context } = props;
  const { model } = context;

  useRhinoDevBroadcastSend({ type: 'ModelShowContext', context });

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelShowContext.Provider value={{ ...props }}>
        <FormProvider {...methods}>{children}</FormProvider>
      </ModelShowContext.Provider>
    </ModelContext.Provider>
  );
};
