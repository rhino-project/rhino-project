import { render } from "@testing-library/react";
import { createMemoryHistory } from 'history';
import { Route, Router } from "react-router-dom";
import AuthenticatedRoute from "rhino/routes/AuthenticatedRoute";

const authenticatedState = {
  initializing: false,
  user: {}
}

const unauthenticatedState = {
  initializing: false,
  user: null
}

const initializingState = {
  initializing: true
}

let mockAuth;
jest.mock('rhino/hooks/auth', () => ({
  useAuth: jest.fn(() => mockAuth) //() => authMock
}));

jest.mock('rhino/components/logos', () => ({
  SplashScreen: () => (
    <div>__mockSplashScreen__</div>
  )
}))

let mockPrevPath;
let mockUnsetPrevPathFn;
let mockSetPrevPathFn;
jest.mock('rhino/utils/storage', () => ({
  getPrevPathSession: () => mockPrevPath,
  unsetPrevPathSession: () => mockUnsetPrevPathFn(),
  setPrevPathSession: () => mockSetPrevPathFn()
}))

jest.mock('rhino/routes', () => ({
  sessionCreate: () => "/__mockSessionCreate__"
}))

describe.only('routes/AuthenticatedRoute', () => {
  let Wrapper;

  beforeEach(() => {
    const history = createMemoryHistory()
    Wrapper = ({children}) => (
      <Router history={history}>
      <AuthenticatedRoute>
        {children}
      </AuthenticatedRoute>
      <Route path="/__mockPrevPath__">
        <div>__mockPrevPathRoute__</div>
      </Route>
      <Route path="/__mockSessionCreate__">
        <div>__mockSessionCreateRoute__</div>
      </Route>
      </Router>
    )
  })

  describe('initializing', () => {
    test("renders SplashScreen", () => {
      mockAuth = initializingState;
      const { queryByText } = render(
        <Wrapper>
          <div>should not render this</div>
        </Wrapper>
      );    
      expect(queryByText('__mockSplashScreen__')).toBeTruthy()
    });
  });

  
  describe('authenticated', () => {
    test('renders children', () => {
      mockAuth = authenticatedState;
      mockPrevPath = '';
      mockUnsetPrevPathFn = jest.fn();
      const { queryByText } = render(
        <Wrapper>
          <div>__should render children__</div>
        </Wrapper>
      );
      expect(queryByText("__should render children__")).toBeTruthy();
    });

    describe('prevPath not empty', () => {
      let queryByText;
      beforeEach(() => {
        mockAuth = authenticatedState;
        mockPrevPath = '/__mockPrevPath__';
        mockUnsetPrevPathFn = jest.fn();
        const rendered = render(
          <Wrapper>
            <div>should not render this</div>
          </Wrapper>
        );
        queryByText = rendered.queryAllByText;
      });
  
      test('redirects to utils\' prevPath', () => {
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
        mockSetPrevPathFn = jest.fn();
        mockUnsetPrevPathFn = jest.fn();
        const component = (dummyProp) => (
          <Wrapper dummyProp={dummyProp}>
            <div>any component</div>
          </Wrapper>
        );
        const rendered = render(
          component(0)
        );
        mockAuth = unauthenticatedState;
        rendered.rerender(component(1));
        queryByText = rendered.queryByText;
      });

      test('does not change prevPath', () => {
        expect(mockSetPrevPathFn).not.toHaveBeenCalled();
        expect(mockUnsetPrevPathFn).not.toHaveBeenCalled();
      });

      test('redirects to sign in page', () => {
        expect(queryByText("__mockSessionCreateRoute__")).toBeTruthy();
      });
    });
  });


  describe('unauthenticated', () => {
    let queryByText;
    beforeEach(() => {
      mockAuth = unauthenticatedState;
      mockSetPrevPathFn = jest.fn();
      const rendered = render(
        <Wrapper>
          <div>should not render this</div>
        </Wrapper>
      );    
      queryByText = rendered.queryByText;
    });

    test('redirects to sign in page', () => {
      expect(queryByText("__mockSessionCreateRoute__")).toBeTruthy();
    });
  
    test('sets prevPath', () => {
      expect(mockSetPrevPathFn).toHaveBeenCalledWith();
    });
  });
});
