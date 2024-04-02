import { createContext } from 'react';
import { FormProvider } from '../forms/FormProvider';
import { ModelContext } from './ModelProvider';
import { useRhinoDevBroadcastSend } from '../../hooks/dev';

export const ModelEditContext = createContext();

export const ModelEditProvider = ({ children, ...props }) => {
  const { methods, ...context } = props;
  const { model } = context;

  useRhinoDevBroadcastSend({ type: 'ModelEditContext', context });

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelEditContext.Provider value={{ ...props }}>
        <FormProvider {...methods}>{children}</FormProvider>
      </ModelEditContext.Provider>
    </ModelContext.Provider>
  );
};
