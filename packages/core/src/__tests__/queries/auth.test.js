import { waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import {
  useSignInAction,
  useSignOutAction,
  useSignUpAction
} from 'rhino/queries/auth';
import { NetworkingMock } from '__tests__/shared/mock';

vi.mock('axios');
const networkingMock = new NetworkingMock();
axios.mockImplementation(networkingMock.axiosMockImplementation());
axios.CancelToken = { source: () => 'adfasdf' };

describe('auth/queries', () => {
  const user = {
    id: 1,
    name: '...',
    email: 'aaa@aaa.com'
  };
  let queryClient;

  describe('Auth queries', () => {
    async function waitForSuccess({ result }, { setup }) {
      setup();
      result.current.main.mutate();

      await waitFor(() => expect(result.current.main.isLoading).toBe(true));

      await waitFor(() => expect(result.current.main.isLoading).toBe(false));
      expect(result.current.main.isSuccess).toBe(true);
    }

    async function waitForFailure({ result }, { setup }) {
      setup();
      act(() => {
        result.current.main.mutate();
      });

      await waitFor(() => expect(result.current.main.isLoading).toBe(true));

      await waitFor(() => expect(result.current.main.isLoading).toBe(false));
      expect(result.current.main.isError).toBe(true);
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

    describe('useSignInAction', () => {
      test('sets isError and makes useAuth output user: null', async () => {
        const renderedHook = await networkingMock.produceUnauthenticatedState({
          queryClient,
          hook: useSignInAction
        });
        await waitForFailure(renderedHook, {
          setup: () => networkingMock.mockSignInFailure()
        });

        await waitFor(() =>
          expect(renderedHook.result.current.auth.resolving).toBe(false)
        );
        expect(renderedHook.result.current.auth.user).toBeNull();
      });

      test('refreshes session and makes useAuth receive user', async () => {
        const renderedHook = await networkingMock.produceUnauthenticatedState({
          queryClient,
          hook: useSignInAction
        });
        await waitForSuccess(renderedHook, {
          setup: () => {
            networkingMock.mockSignInSuccess(user);
            networkingMock.mockValidateSessionSuccess(user);
          }
        });

        await waitFor(() =>
          expect(renderedHook.result.current.auth.resolving).toBe(false)
        );
        expect(renderedHook.result.current.auth.user).toEqual(user);
      });
    });

    describe('useSignUpAction', () => {
      test('persists headers in session when successful', async () => {
        const renderedHook = await networkingMock.produceUnauthenticatedState({
          queryClient,
          hook: useSignUpAction
        });
        await waitForSuccess(renderedHook, {
          setup: () => {
            networkingMock.mockSignUpSuccess(user);
            networkingMock.mockValidateSessionSuccess(user);
          }
        });

        expect(renderedHook.result.current.auth.resolving).toBe(false);
      });

      test('sets isError and makes useAuth output user: null', async () => {
        const renderedHook = await networkingMock.produceUnauthenticatedState({
          queryClient,
          hook: useSignUpAction
        });
        await waitForFailure(renderedHook, {
          setup: () => networkingMock.mockSignUpFailure()
        });

        await waitFor(() =>
          expect(renderedHook.result.current.auth.resolving).toBe(false)
        );
        expect(renderedHook.result.current.auth.user).toBeNull();
      });

      test('refreshes session and makes useAuth receive user', async () => {
        const renderedHook = await networkingMock.produceUnauthenticatedState({
          queryClient,
          hook: useSignUpAction
        });
        await waitForSuccess(renderedHook, {
          setup: () => {
            networkingMock.mockSignUpSuccess(user);
            networkingMock.mockValidateSessionSuccess(user);
          }
        });

        await waitFor(() =>
          expect(renderedHook.result.current.auth.resolving).toBe(false)
        );
        expect(renderedHook.result.current.auth.user).toEqual(user);
      });
    });

    describe('useSignOutAction', () => {
      let renderedHook;
      beforeEach(async () => {
        renderedHook = await networkingMock.produceAuthenticatedState({
          queryClient,
          hook: useSignOutAction,
          user
        });
      });

      test('interacts with auth so useAuth now emits null as user after signOut success', async () => {
        await waitForSuccess(renderedHook, {
          setup: () => {
            networkingMock.mockSignOutSuccess();
          }
        });
        await waitFor(() =>
          expect(renderedHook.result.current.auth.resolving).toBe(false)
        );
        expect(renderedHook.result.current.auth.user).toBeNull();
      });

      test('interacts with auth so useAuth now continues emitting the same user after signOut failure', async () => {
        await waitForFailure(renderedHook, {
          setup: () => {
            networkingMock.mockSignOutFailure();
          }
        });
        await waitFor(() =>
          expect(renderedHook.result.current.auth.resolving).toBe(false)
        );
        expect(renderedHook.result.current.auth.user).toEqual(user);
      });

      test('upon a 404, interacts with auth so useAuth emits null as user after signOut', async () => {
        await waitForFailure(renderedHook, {
          setup: () => {
            networkingMock.mockSignOutFailure(404);
            networkingMock.mockValidateSessionFailure();
          }
        });
        await waitFor(() =>
          expect(renderedHook.result.current.auth.resolving).toBe(false)
        );
        expect(renderedHook.result.current.auth.user).toBeNull();
      });
    });
  });
});
