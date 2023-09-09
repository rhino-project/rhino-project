import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route, Router } from 'react-router-dom';
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

vi.spyOn(routes, 'getRootPath').mockImplementation(() => '/__mockRootPath__');

describe('routes/NonAuthenticatedRoute', () => {
  let Wrapper;

  beforeEach(() => {
    const history = createMemoryHistory();
    Wrapper = ({ children }) => (
      <Router history={history}>
        <NonAuthenticatedRoute>{children}</NonAuthenticatedRoute>
        <Route path="/__mockRootPath__">
          <div>__mockRootPathRoute__</div>
        </Route>
      </Router>
    );
  });

  describe('initializing', () => {
    test('renders SplashScreen', () => {
      mockAuth = initializingState;
      const { getByText } = render(
        <Wrapper>
          <div>should not render this</div>
        </Wrapper>
      );
      expect(getByText('__mockSplashScreen__')).toBeTruthy();
    });
  });

  describe('authenticated', () => {
    test('redirects to rootPath', () => {
      mockAuth = authenticatedState;
      const { getByText } = render(<div>__should not render this__</div>, {
        wrapper: Wrapper
      });

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
