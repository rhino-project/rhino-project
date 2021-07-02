# Error reporting for React applications

Establishing an error reporting strategy demands a good understanding of [React's error boundaries](https://reactjs.org/docs/error-boundaries.html). Errour boundaries can catch errors thrown during components rendering, but not the ones thrown in event handlers, like buttons' `onClick` callbacks, and also not unhandled promise rejections. This [section](https://reactjs.org/docs/error-boundaries.html#how-about-event-handlers) explains it.

It is needed, however, that all types of unhandled errors are caught. Rollbar provides a nice and easy way to accomplish that, simply by passing the right configuration options.

## Making it work

The **only** environment variable **necessary to make Rollbar work** is `REACT_APP_ROLLBAR_ACCESS_TOKEN`, that can be found in the `env.sample` file. By default, Rollbar will not work if there's no access token set, but neither will it break the application.

The right key can be retrieved from Rollbar's UI following the path `Projects > your project in the central list > Project Access Tokens > key named post_client_item`.

## Concepts

### Configuration

The general configuration is this:

```javascript
const rollbarConfig = {
  accessToken: env.ROLLBAR_ACCESS_TOKEN,
  environment: env.name,
  enabled: env.ROLLBAR_ACCESS_TOKEN && env.name === "production",
  captureUncaught: true,
  captureUnhandledRejections: true,
};
```

1. grabs the access token from the environment variables
2. sets the environment name
3. only enables it if in production and if it has a valid access token
4. captures all uncaught exceptions
5. captures all uncaught promise rejections

### Rollbar's Context and ErrorBoundary

Rollbar's docs instruct to wrap the whole components tree under Rollbar's context and error boundary.

```html
<Provider config="{rollbarConfig}">
  <ErrorBoundary>
    <div>
      <QueryClientProvider client="{queryClient}">
        <AuthProvider>
          <ReactQueryDevtools initialIsOpen="{false}" />
          <Helmet />
          <Router />
          ...</AuthProvider
        ></QueryClientProvider
      >
    </div></ErrorBoundary
  ></Provider
>
```

### Custom error boundaries

Any custom error boundary in use in the app must either call Rollbar directly and report the error or re-throw the error, so Rollbar's error boundary can catch it and report it.

For example:

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    throw error;
  }
  ...
```

### User identification

It can be useful to know which user suffered from the error. It's possible to set the user information under Rollbar's context, so itis currently being done in `AuthProvider`:

```javascript
// AuthContext.js

const AuthProvider = ({ children }) => {
  const sessionQuery = useSession();
  const { isError, isLoading, isSuccess, data, refetch } = sessionQuery;
  const [user, setUser] = useState(null);
  const [resolving, setResolving] = useState(true);
  useRollbarPerson(user);
  ...
```

### Tests

Some Rollbar features interfere with tests, making them fail, in particular the `useRollbarPerson` hook. It is necessary to mock it in each test that directly or indirectly uses it.

```javascript
jest.mock("@rollbar/react", () => ({
  useRollbarPerson: (person) => null,
}));
```

## TODO: Source maps

In a production environment, Rollbar is only able to see the minified version of the code, which doesn't help with debugging. In order to improve that, it's necessary to inform the version of the release and upload the soource maps files. This [answer](https://github.com/rollbar/rollbar.js/issues/728#issuecomment-495409109) points to a really good direction.

Also, Heroku's post build script in package.json can be a good place to issue the source maps upload command.
