import { act, renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { NetworkingMock } from '../shared/mock';
import { RhinoProvider, useRhinoContext } from '@rhino-project/core';

vi.mock('axios');
const networkingMock = new NetworkingMock();
axios.mockImplementation(networkingMock.axiosMockImplementation());

describe('AuthenticatedRoute', () => {
  const user = { id: 1, name: '', email: '' };
  let queryClient;

  function Wrapper({ children }) {
    return (
      <RhinoProvider queryClient={queryClient} forceStatic>
        {children}
      </RhinoProvider>
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

  test('Invalidates router when user becomes null', async () => {
    networkingMock.mockValidateSessionSuccess(user);
    const { result } = renderHook(() => useRhinoContext(), {
      wrapper: Wrapper
    });

    await waitFor(() => expect(result.current.user).toEqual(user));

    networkingMock.mockValidateSessionFailure();
    await act(async () => {
      await queryClient.refetchQueries({ queryKey: ['session'] });
    });

    await waitFor(() => expect(result.current.user).toBeNull());
  });
});
