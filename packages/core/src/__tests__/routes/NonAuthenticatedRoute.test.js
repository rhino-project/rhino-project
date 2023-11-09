import { render } from '@testing-library/react';
import { MemoryRouter, Navigate, Route, Routes } from 'react-router';
import NonAuthenticatedRoute from 'rhino/routes/NonAuthenticatedRoute';
import * as routes from 'rhino/utils/routes';

const authenticatedState = {
  initializing: false,
  user: {}
};

const unauthenticatedState = {
  initializing: false,
  user: null
};

const initializingState = {
  initializing: true
};

let mockAuth;
vi.mock('rhino/hooks/auth', () => ({
  useAuth: vi.fn(() => mockAuth) //() => authMock
}));

vi.mock('rhino/components/logos', () => ({
  SplashScreen: () => <div>__mockSplashScreen__</div>
}));

vi.spyOn(routes, 'getAuthenticatedAppPath').mockImplementation(
  () => '/__mockRootPath__'
);

function Wrapper({ children }) {
  return (
    <MemoryRouter initialEntries={['/__auth__']}>
      <Routes>
        <Route path="/*" element={<Navigate to="/__auth__" />} />
        <Route
          path="/__auth__"
          element={<NonAuthenticatedRoute>{children}</NonAuthenticatedRoute>}
        />
        <Route
          path="/__mockRootPath__"
          element={<div>__mockRootPathRoute__</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('routes/NonAuthenticatedRoute', () => {
  describe('initializing', () => {
    test('renders SplashScreen', () => {
      mockAuth = initializingState;
      const { getByText } = render(<div>should not render this</div>, {
        wrapper: Wrapper
      });
      expect(getByText('__mockSplashScreen__')).toBeTruthy();
    });
  });

  describe('authenticated', () => {
    test('redirects to rootPath', () => {
      mockAuth = authenticatedState;
      const { getByText } = render(
        <Wrapper>
          <div>__should not render this__</div>
        </Wrapper>
      );

      expect(getByText('__mockRootPathRoute__')).toBeTruthy();
    });
  });

  describe('unauthenticated', () => {
    test('renders children', () => {
      mockAuth = unauthenticatedState;
      const { getByText } = render(
        <Wrapper>
          <div>__should render children__</div>
        </Wrapper>
      );
      expect(getByText('__should render children__')).toBeTruthy();
    });
  });
});
