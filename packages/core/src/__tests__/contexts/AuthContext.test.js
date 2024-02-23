import { render, renderHook, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { AuthProvider, AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NetworkingMock } from '../shared/mock';

vi.mock('axios');
const networkingMock = new NetworkingMock();
axios.mockImplementation(networkingMock.axiosMockImplementation());
axios.CancelToken = { source: () => 'adfasdf' };

describe('AuthContext', () => {
  const user = { id: 1, name: '', email: '' };
  let queryClient;

  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <h1>__AuthContext test__</h1>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  function Inner() {
    const authContext = useContext(AuthContext);
    return (
      <h1>resolving: {authContext.resolving === true ? 'true' : 'false'}</h1>
    );
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      },
      logger: {
        error: () => {}
      }
    });
  });

  test('Sets user and resolving when sessionQuery is successful', async () => {
    networkingMock.mockValidateSessionSuccess(user);
    const { result } = renderHook(() => useContext(AuthContext), {
      wrapper: Wrapper
    });
    expect(result.current.user).toBeNull();
    expect(result.current.resolving).toBe(true);

    await waitFor(() => expect(result.current.resolving).toBe(false));
    expect(result.current.user).toEqual(user);
  });

  test('Sets user and resolving when sessionQuery is failure', async () => {
    networkingMock.mockValidateSessionFailure(user);
    const { result } = renderHook(() => useContext(AuthContext), {
      wrapper: Wrapper
    });
    expect(result.current.user).toBeNull();
    expect(result.current.resolving).toBe(true);

    await waitFor(() => expect(result.current.resolving).toBe(false));
    expect(result.current.user).toBeNull();
  });

  test('Does not clean user when already logged in and session is refetched', async () => {
    const renderedHook = await networkingMock.produceAuthenticatedState({
      queryClient,
      user
    });

    const changedUser = { ...user, email: 'changed@mail.com' };
    networkingMock.mockValidateSessionSuccess(changedUser);
    renderedHook.result.current.auth.refreshSession();

    await waitFor(() =>
      expect(renderedHook.result.current.auth.resolving).toBe(true)
    );
    expect(renderedHook.result.current.auth.user).toBeTruthy();

    await waitFor(() =>
      expect(renderedHook.result.current.auth.resolving).toBe(false)
    );
    expect(renderedHook.result.current.auth.user).toEqual(changedUser);
  });

  test('Cleans user when already logged in and session fails in refetching', async () => {
    const renderedHook = await networkingMock.produceAuthenticatedState({
      queryClient,
      user
    });

    networkingMock.mockValidateSessionFailure();
    renderedHook.result.current.auth.refreshSession();

    await waitFor(() =>
      expect(renderedHook.result.current.auth.resolving).toBe(true)
    );
    expect(renderedHook.result.current.auth.user).toBeTruthy();

    await waitFor(() =>
      expect(renderedHook.result.current.auth.resolving).toBe(false)
    );
    expect(renderedHook.result.current.auth.user).toBeNull();
  });

  describe('initializing', () => {
    test('Starts with initializing: true', () => {
      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: Wrapper
      });
      expect(result.current.initializing).toBe(true);
    });

    test('Sets initializing to false after success', async () => {
      networkingMock.mockValidateSessionSuccess(user);
      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: Wrapper
      });
      expect(result.current.user).toBeNull();
      expect(result.current.initializing).toBe(true);

      await waitFor(() => expect(result.current.initializing).toBe(false));
      expect(result.current.user).toBeTruthy();
    });

    test('Sets initializing to false after failure', async () => {
      networkingMock.mockValidateSessionFailure();
      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: Wrapper
      });
      expect(result.current.user).toBeNull();
      expect(result.current.initializing).toBe(true);

      await waitFor(() => expect(result.current.initializing).toBe(false));
      expect(result.current.user).toBeFalsy();
    });
  });

  test('Renders children when authenticated', async () => {
    networkingMock.mockValidateSessionSuccess(user);

    render(
      <Wrapper>
        <Inner />
      </Wrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('resolving: true')).toBeTruthy();
    });
    await waitFor(() => {
      expect(screen.getByText('resolving: false')).toBeTruthy();
    });
  });

  test('Renders children when not authenticated', async () => {
    networkingMock.mockValidateSessionSuccess(user);

    render(
      <Wrapper>
        <Inner />
      </Wrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('resolving: true')).toBeTruthy();
    });
    await waitFor(() => {
      expect(screen.getByText('resolving: false')).toBeTruthy();
    });
  });
});
