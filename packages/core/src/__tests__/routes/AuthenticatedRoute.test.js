import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route, Router } from 'react-router-dom';
import AuthenticatedRoute from 'rhino/routes/AuthenticatedRoute';
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

let mockPrevPath;
let mockUnsetPrevPathFn;
let mockSetPrevPathFn;
vi.mock('rhino/utils/storage', () => ({
  getPrevPathSession: () => mockPrevPath,
  unsetPrevPathSession: () => mockUnsetPrevPathFn(),
  setPrevPathSession: () => mockSetPrevPathFn()
}));

vi.spyOn(routes, 'getSessionCreatePath').mockImplementation(
  () => '/__mockSessionCreate__'
);

describe('routes/AuthenticatedRoute', () => {
  const history = createMemoryHistory();

  const Wrapper = ({ children }) => {
    return (
      <Router history={history}>
        <AuthenticatedRoute>{children}</AuthenticatedRoute>
        <Route path="/__mockPrevPath__">
          <div>__mockPrevPathRoute__</div>
        </Route>
        <Route path="/__mockSessionCreate__">
          <div>__mockSessionCreateRoute__</div>
        </Route>
      </Router>
    );
  };

  describe('initializing', () => {
    test('renders SplashScreen', () => {
      mockAuth = initializingState;
      const { queryByText } = render(<div>should not render this</div>, {
        wrapper: Wrapper
      });
      expect(queryByText('__mockSplashScreen__')).toBeTruthy();
    });
  });

  describe('authenticated', () => {
    test('renders children', () => {
      mockAuth = authenticatedState;
      mockPrevPath = '';
      mockUnsetPrevPathFn = vi.fn();
      const { queryByText } = render(<div>__should render children__</div>, {
        wrapper: Wrapper
      });
      expect(queryByText('__should render children__')).toBeTruthy();
    });

    describe('prevPath not empty', () => {
      let queryByText;
      beforeEach(() => {
        mockAuth = authenticatedState;
        mockPrevPath = '/__mockPrevPath__';
        mockUnsetPrevPathFn = vi.fn();
        const rendered = render(<div>should not render this</div>, {
          wrapper: Wrapper
        });
        queryByText = rendered.queryAllByText;
      });

      test("redirects to utils' prevPath", () => {
        expect(queryByText('__mockPrevPathRoute__')).toBeTruthy();
      });

      test('cleans prevPath', () => {
        expect(mockUnsetPrevPathFn).toHaveBeenCalled();
      });
    });

    describe('sign out', () => {
      let queryByText;

      beforeEach(() => {
        mockAuth = authenticatedState;
        mockPrevPath = null;
        mockSetPrevPathFn = vi.fn();
        mockUnsetPrevPathFn = vi.fn();

        const rendered = render(<div>any component</div>, { wrapper: Wrapper });
        mockAuth = unauthenticatedState;
        rendered.rerender();
        queryByText = rendered.queryByText;
      });

      test('does not change prevPath', () => {
        expect(mockSetPrevPathFn).not.toHaveBeenCalled();
        expect(mockUnsetPrevPathFn).not.toHaveBeenCalled();
      });

      test('redirects to sign in page', () => {
        expect(queryByText('__mockSessionCreateRoute__')).toBeTruthy();
      });
    });
  });

  describe('unauthenticated', () => {
    let queryByText;
    beforeEach(() => {
      mockAuth = unauthenticatedState;
      mockSetPrevPathFn = vi.fn();
      const rendered = render(
        <Wrapper>
          <div>should not render this</div>
        </Wrapper>
      );
      queryByText = rendered.queryByText;
    });

    test('redirects to sign in page', () => {
      expect(queryByText('__mockSessionCreateRoute__')).toBeTruthy();
    });

    test('sets prevPath', () => {
      expect(mockSetPrevPathFn).toHaveBeenCalledWith();
    });
  });
});
