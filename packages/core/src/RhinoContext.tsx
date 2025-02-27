import React, {
  createContext,
  useContext,
  ReactNode,
  Suspense,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect
} from 'react';
import { OpenAPIV3_1 } from './rhino-openapi';
import { Resources, RhinoResource } from './index';
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
import { hasOrganizationsModule } from './utils';

export type SessionUserRoles = {
  id: number;
  organization: { id: number; [key: string]: unknown };
};

export type SessionUser = {
  id: number;
  provider: string;
  uid: string;
  name: string | null;
  nickname: string | null;
  image: string | null;
  email: string | null;
  allow_password_change: boolean;
  approved: boolean;
  users_roles?: SessionUserRoles[];
};

export type SessionResponse = {
  data: {
    success: boolean;
    data: SessionUser | null;
  };
};

// FIXME the user and owner types need to be better defined
export interface RhinoContextType {
  // @ts-expect-error this will be defined in the client application

  user: Resources['user'] | null;
  baseOwner: { id: number; [key: string]: unknown } | null;
  setBaseOwner: (
    baseOwner:
      | SessionResponse['data']['data']
      | SessionUserRoles['organization']
      | null
  ) => void;
  usersRoles: SessionUserRoles[];
  logIn: (user: SessionUser) => void;
  logOut: () => void;
  resources: Record<keyof Resources, RhinoResource>;
  openApiSpec: OpenAPIV3_1.Document;
  queryClient: QueryClient;
}
interface RhinoProviderProps {
  children: ReactNode;
  forceStatic?: boolean;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prop = properties[property] as any;

      if (prop && prop['x-rhino-attribute']) {
        Object.assign(prop, prop['x-rhino-attribute']);
      }

      // OpenAPI does required on the model level, we need it on the
      // attribute level for efficiency

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
      (mod) => mod.default as OpenAPIV3_1.Document
    );
  }

  return (await networkApiCallOnlyData(
    '/api/info/openapi'
  )) as OpenAPIV3_1.Document;
};

const defaultQueryClient = new QueryClient({});

export const RhinoContext = createContext<RhinoContextType>({
  baseOwner: null,
  setBaseOwner: undefined!,
  usersRoles: [],
  logIn: () => {},
  logOut: () => {},
  openApiSpec: {
    openapi: '3.0.3',
    info: { title: 'Rhino OpenAPI', version: '0.0.0' },
    components: {}
  },
  resources: {},
  user: null,
  queryClient: defaultQueryClient
});

export const useRhinoContext = () => useContext(RhinoContext);

const RhinoContent: React.FC<RhinoProviderProps> = ({
  children,
  forceStatic = false,
  ...props
}) => {
  const { env } = useRhinoConfig();
  const { queryClient } = props;
  const isOrganization = hasOrganizationsModule();

  const [user, setUser] = useState<SessionUser | null>(null);
  const [baseOwner, setBaseOwner] = useState<
    SessionUser | SessionUserRoles['organization'] | null
  >(null);
  const [usersRoles, setUsersRoles] = useState<SessionUserRoles[]>([]);

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
  const { isError, isSuccess, data, refetch } = useQuery({
    queryKey: AUTH_SESSION_KEY,
    queryFn: async ({ signal }): Promise<void | SessionResponse> => {
      try {
        const data = await networkApiCall(AUTH_VALIDATE_TOKEN_END_POINT, {
          signal
        });

        // await new Promise((resolve) => setTimeout(resolve, 5000));

        return data;
        // FIXME in RQ 5 there is a param to not throw an error to the boundary
      } catch {
        return { data: { success: false, data: null } };
      }
    },
    retry: false,
    suspense: true
  });

  // FIXME: this should be sideloaded elsewhere
  // useRollbarPerson(user);

  // Enforce the user is set correctly before a render
  // https://github.com/TanStack/router/blob/d372e99dd8a6eaeb65df63836170fd70aa2f09af/examples/react/kitchen-sink-file-based/src/routes/login.tsx#L27
  useLayoutEffect(() => {
    // If we have a user and we are not already set
    // FIXME: Update if the user info changes?  ie not deep equal
    if (isSuccess && data?.data.data && !user) {
      const newUser = data.data.data;
      setUser(newUser);
      if (isOrganization) {
        const usersRoles = newUser?.users_roles ?? [];

        // FIXME: Where to handle no roles?
        setBaseOwner(usersRoles?.[0]?.organization || null);
        setUsersRoles(usersRoles);
      } else {
        setBaseOwner(newUser);
        setUsersRoles([]);
      }
      // If there is an error, or we caught one, clear everything
    } else if (isError || !data?.data.data) {
      setUser(null);
      setBaseOwner(null);
      setUsersRoles([]);
    }
  }, [isError, isSuccess, data, isOrganization, user]);

  const logIn = useCallback(
    async (user: SessionUser) => {
      setUser(user);
      if (isOrganization) {
        const usersRoles = user?.users_roles ?? [];

        // FIXME: Where to handle no roles?
        setBaseOwner(usersRoles?.[0]?.organization || null);
        setUsersRoles(usersRoles);
      } else {
        setBaseOwner(user);
        setUsersRoles([]);
      }

      // Ensure the session validation is up to date
      await refetch();
    },
    [isOrganization, refetch]
  );

  const logOut = useCallback(async () => {
    setUser(null);
    setBaseOwner(null);
    setUsersRoles([]);

    // Ensure the session validation is up to date
    await refetch();

    queryClient.clear();
  }, [queryClient, refetch]);

  return (
    <RhinoContext.Provider
      value={{
        resources,
        openApiSpec: openApiSpec as OpenAPIV3_1.Document,
        baseOwner,
        setBaseOwner,
        usersRoles,
        user,
        logOut,
        logIn,
        ...props
      }}
    >
      {children}
    </RhinoContext.Provider>
  );
};

export const RhinoProvider: React.FC<RhinoProviderProps> = ({
  queryClient = defaultQueryClient,
  ...props
}) => {
  return (
    <Suspense fallback="Rhino Context">
      <QueryClientProvider client={queryClient}>
        <RhinoContent queryClient={queryClient} {...props} />
      </QueryClientProvider>
    </Suspense>
  );
};
