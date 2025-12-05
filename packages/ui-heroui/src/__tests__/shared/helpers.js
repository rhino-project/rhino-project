import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider
} from '@tanstack/react-router';

export const RouterWrapper = ({ children, ...props }) => {
  const queryClient = new QueryClient();
  const history = createMemoryHistory({
    ...props
  });
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/'
  });
  const ownerRoute = createRoute({
    getParentRoute: () => indexRoute,
    path: '$owner',
    component: () => <>{children}</>
  });
  const routeTree = rootRoute.addChildren([
    indexRoute.addChildren([ownerRoute])
  ]);
  const defaultRouter = createRouter({
    routeTree,
    history
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={defaultRouter} />
    </QueryClientProvider>
  );
};

export const createWrapper = (Wrapper, props) => {
  return function CreatedWrapper({ children }) {
    return <Wrapper {...props}>{children}</Wrapper>;
  };
};
