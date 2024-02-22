import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthenticatedRoute from '../../routes/AuthenticatedRoute';
import * as routes from '../../utils/routes';

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
  () => '__mockSessionCreate__'
);
vi.spyOn(routes, 'getNonAuthenticatedAppPath').mockImplementation(
  () => '/__notAuthenticated__'
);

function Wrapper({ children }) {
  return (
    <MemoryRouter initialEntries={['/__authenticated__']}>
      <Routes>
        <Route
          path="/__authenticated__"
          element={<AuthenticatedRoute>{children}</AuthenticatedRoute>}
        />
        <Route
          path="/__mockPrevPath__"
          element={<div>__mockPrevPathRoute__</div>}
        />
        <Route path="/__notAuthenticated__">
          <Route
            path="__mockSessionCreate__"
            element={<div>__mockSessionCreateRoute__</div>}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('routes/AuthenticatedRoute', () => {
  describe('initializing', () => {
    test('renders SplashScreen', () => {
      mockAuth = initializingState;
      render(<div>should not render this</div>, {
        wrapper: Wrapper
      });
      expect(screen.getByText('__mockSplashScreen__')).toBeTruthy();
    });
  });

  describe('authenticated', () => {
    test('renders children', () => {
      mockAuth = authenticatedState;
      mockPrevPath = '';
      mockUnsetPrevPathFn = vi.fn();
      render(<div>__should render children__</div>, {
        wrapper: Wrapper
      });
      expect(screen.getByText('__should render children__')).toBeTruthy();
    });

    describe('prevPath not empty', () => {
      beforeEach(() => {
        mockAuth = authenticatedState;
        mockPrevPath = '/__mockPrevPath__';
        mockUnsetPrevPathFn = vi.fn();
      });

      test("redirects to utils' prevPath", () => {
        render(<div>should not render this</div>, {
          wrapper: Wrapper
        });
        expect(screen.getByText('__mockPrevPathRoute__')).toBeTruthy();
      });

      test('cleans prevPath', () => {
        render(<div>should not render this</div>, {
          wrapper: Wrapper
        });
        expect(mockUnsetPrevPathFn).toHaveBeenCalled();
      });
    });

    describe('sign out', () => {
      beforeEach(() => {
        mockAuth = authenticatedState;
        mockPrevPath = null;
        mockSetPrevPathFn = vi.fn();
        mockUnsetPrevPathFn = vi.fn();
      });

      test('does not change prevPath', () => {
        const { rerender } = render(<div>any component</div>, {
          wrapper: Wrapper
        });
        mockAuth = unauthenticatedState;
        rerender();
        expect(mockSetPrevPathFn).not.toHaveBeenCalled();
        expect(mockUnsetPrevPathFn).not.toHaveBeenCalled();
      });

      test('redirects to sign in page', () => {
        const { rerender } = render(<div>any component</div>, {
          wrapper: Wrapper
        });
        mockAuth = unauthenticatedState;
        rerender();
        expect(screen.getByText('__mockSessionCreateRoute__')).toBeTruthy();
      });
    });
  });

  describe('unauthenticated', () => {
    beforeEach(() => {
      mockAuth = unauthenticatedState;
      mockSetPrevPathFn = vi.fn();
    });

    test('redirects to sign in page', () => {
      render(
        <Wrapper>
          <div>should not render this</div>
        </Wrapper>
      );
      expect(screen.getByText('__mockSessionCreateRoute__')).toBeTruthy();
    });

    test('sets prevPath', () => {
      render(
        <Wrapper>
          <div>should not render this</div>
        </Wrapper>
      );
      expect(mockSetPrevPathFn).toHaveBeenCalledWith();
    });
  });
});
