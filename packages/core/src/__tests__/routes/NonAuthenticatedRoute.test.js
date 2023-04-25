import { render } from "@testing-library/react";
import { createMemoryHistory } from 'history';
import { Route, Router } from "react-router-dom";
import NonAuthenticatedRoute from "rhino/routes/NonAuthenticatedRoute";
import * as routes from "rhino/utils/routes";


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

jest.spyOn(routes, 'getRootPath').mockImplementation(() => "/__mockRootPath__");


describe.only('routes/NonAuthenticatedRoute', () => {
  let Wrapper;

  beforeEach(() => {
    const history = createMemoryHistory()
    Wrapper = ({children}) => (
      <Router history={history}>
      <NonAuthenticatedRoute>
        {children}
      </NonAuthenticatedRoute>
      <Route path="/__mockRootPath__">
        <div>__mockRootPathRoute__</div>
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
    test('redirects to rootPath', () => {
      mockAuth = authenticatedState;
      const { queryByText } = render(
        <Wrapper>
          <div>__should not render this__</div>
        </Wrapper>
      );    
      expect(queryByText("__mockRootPathRoute__")).toBeTruthy();
    });
  })


  describe('unauthenticated', () => {
    test('renders children', () => {
      mockAuth = unauthenticatedState;
      const { queryByText } = render(
        <Wrapper>
          <div>__should render children__</div>
        </Wrapper>
      );    
      expect(queryByText("__should render children__")).toBeTruthy();
    })
  });
});