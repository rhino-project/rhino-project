import { render } from '@testing-library/react';
import { RhinoContext } from '@rhino-project/core';
import { NonAuthenticatedRoute } from '../../routes';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider
} from '@tanstack/react-router';
import { useAuth } from '@rhino-project/core/hooks';

const history = createMemoryHistory({ initialEntries: ['/'] });

const rootRoute = createRootRoute();
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <NonAuthenticatedRoute />
});

const routeTree = rootRoute.addChildren([indexRoute]);
const defaultRouter = createRouter({
  routeTree,
  history
});

const user = { id: 1, name: '', email: '' };
vi.spyOn(defaultRouter, 'invalidate');

vi.mock('@rhino-project/core/hooks', () => ({
  useAuth: vi.fn()
}));

// Create a helper to set the auth state
function mockAuthState(user) {
  vi.mocked(useAuth).mockReturnValue({ user });
}

export const RouterWrapper = () => {
  return <RouterProvider router={defaultRouter} />;
};

describe('NonAuthenticatedRoute', () => {
  test('Invalidates router when user becomes null', async () => {
    mockAuthState(user);

    render(
      <RouterWrapper>
        <RhinoContext.Provider />
      </RouterWrapper>
    );

    expect(defaultRouter.invalidate).toHaveBeenCalledOnce();
  });
});
