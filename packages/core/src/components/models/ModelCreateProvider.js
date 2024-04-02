import { createContext } from 'react';
import { FormProvider } from '../forms/FormProvider';
import { ModelContext } from './ModelProvider';
import { useRhinoDevBroadcastSend } from '../../hooks/dev';

export const ModelCreateContext = createContext();

export const ModelCreateProvider = ({ children, ...props }) => {
  const { methods, ...context } = props;
  const { model } = context;

  useRhinoDevBroadcastSend({ type: 'ModelCreateContext', context });

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelCreateContext.Provider value={{ ...props }}>
        <FormProvider {...methods}>{children}</FormProvider>
      </ModelCreateContext.Provider>
    </ModelContext.Provider>
  );
};
