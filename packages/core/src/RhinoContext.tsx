import React, {
  createContext,
  useContext,
  ReactNode,
  Suspense,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import { OpenAPIV3_1 } from './rhino-openapi';
import { Resources, RhinoResource } from '..';
import { cloneDeep } from 'lodash-es';
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query';
import {
  AUTH_SESSION_KEY,
  AUTH_VALIDATE_TOKEN_END_POINT,
  networkApiCall,
  networkApiCallOnlyData
} from './lib/networking';
// import { useRollbarPerson } from '@rollbar/react';
import { useRhinoConfig } from './config';

type ValidateTokenUser = {
  id: number;
  provider: string;
  uid: string;
  name: string | null;
  nickname: string | null;
  image: string | null;
  email: string | null;
  allow_password_change: boolean;
  approved: boolean;
};

type ValidateTokenResponse = {
  data: {
    success: boolean;
    data: ValidateTokenUser;
  };
};

// FIXME the user and owner types need to be better defined
export interface RhinoContextType {
  // @ts-expect-error this will be defined in the client application
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  user: Resources['user'] | null;
  baseOwner: { id: number; [key: string]: unknown } | null;
  initializing: boolean;
  logIn: (user: ValidateTokenUser) => void;
  logOut: () => void;
  refreshSession: () => Promise<unknown>;
  resolving: boolean;
  resources: Resources;
  openApiSpec: OpenAPIV3_1.Document;
}
interface RhinoProviderProps {
  children: ReactNode;
  forceStatic: boolean;
  queryClient: QueryClient;
}

const OPENAPI_QUERY_KEY = ['openapi'];

// FIXME: Good also add global owned flag, is reference flag, etc.
const hoistRhino = (
  data: OpenAPIV3_1.Document | undefined
): Record<string, RhinoResource> => {
  const models = cloneDeep(data?.components?.schemas);
  if (!models) return {};

  Object.keys(models).forEach((schema) => {
    const model = models[schema] as RhinoResource;

    if (model && model['x-rhino-model']) {
      Object.assign(model, model['x-rhino-model']);
    }

    const properties = model?.properties || {};

    Object.keys(properties).forEach((property) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      const prop = properties[property] as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (prop && prop['x-rhino-attribute']) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        Object.assign(prop, prop['x-rhino-attribute']);
      }

      // OpenAPI does required on the model level, we need it on the
      // attribute level for efficiency
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      prop['x-rhino-required'] = model?.required?.includes(property) ?? false;
    });
  });

  return models as Record<string, RhinoResource>;
};

const fetchOpenApiSpec = async (
  loadStatic = false
): Promise<OpenAPIV3_1.Document> => {
  if (loadStatic) {
    // @ts-expect-error this will be defined in the client application
    return import('models/static').then(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (mod) => mod.default as OpenAPIV3_1.Document
    );
  }

  return (await networkApiCallOnlyData(
    'api/info/openapi'
  )) as OpenAPIV3_1.Document;
};

export const RhinoContext = createContext<RhinoContextType>({
  baseOwner: null,
  initializing: true,
  logIn: () => {},
  logOut: () => {},
  openApiSpec: {
    openapi: '3.0.3',
    info: { title: 'Rhino OpenAPI', version: '0.0.0' },
    components: {}
  },
  refreshSession: () => Promise.resolve(),
  resolving: false,
  resources: {},
  user: null
});

export const useRhinoContext = () => useContext(RhinoContext);

const RhinoContent: React.FC<Omit<RhinoProviderProps, 'queryClient'>> = ({
  children,
  forceStatic = false
}) => {
  const { env } = useRhinoConfig();

  // Load the OpenAPI spec from either the development end point or the static file written by the vite plugin
  const loadStatic = env.PROD || forceStatic;
  const queryFn = useCallback(() => fetchOpenApiSpec(loadStatic), [loadStatic]);
  const { data: openApiSpec } = useQuery({
    queryKey: OPENAPI_QUERY_KEY,
    queryFn,
    suspense: true
  });
  const resources = useMemo(() => hoistRhino(openApiSpec), [openApiSpec]);

  // Check for an active session
  const { isError, isInitialLoading, isFetching, isSuccess, data, refetch } =
    useQuery({
      queryKey: AUTH_SESSION_KEY,
      queryFn: ({ signal }): Promise<void | ValidateTokenResponse> =>
        networkApiCall(AUTH_VALIDATE_TOKEN_END_POINT, { signal }),
      retry: false
    });

  const [user, setUser] = useState<
    ValidateTokenResponse['data']['data'] | null
  >(null);
  const [baseOwner] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // FIXME: this should be sideloaded elsewhere
  // useRollbarPerson(user);

  useEffect(() => {
    if (isSuccess || isError) setInitializing(false);
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccess && data?.data.data) {
      setUser(data.data.data);
    } else if (isError) {
      setUser(null);
    }
  }, [isError, isInitialLoading, isSuccess, data]);

  const logOut = useCallback(() => {
    setUser(null);
  }, []);

  const logIn = useCallback((user: ValidateTokenResponse['data']['data']) => {
    setUser(user);
  }, []);

  return (
    <RhinoContext.Provider
      value={{
        resources,
        openApiSpec: openApiSpec as OpenAPIV3_1.Document,
        baseOwner,
        user,
        resolving: isFetching,
        initializing,
        logOut,
        logIn,
        // FIXME: still needed?
        refreshSession: refetch
      }}
    >
      {children}
    </RhinoContext.Provider>
  );
};

const defaultQueryClient = new QueryClient({});

export const RhinoProvider: React.FC<RhinoProviderProps> = ({
  queryClient = defaultQueryClient,
  ...props
}) => {
  return (
    <Suspense fallback={<div>Loading OpenAPI spec...</div>}>
      <QueryClientProvider client={queryClient}>
        <RhinoContent {...props} />
      </QueryClientProvider>
    </Suspense>
  );
};
