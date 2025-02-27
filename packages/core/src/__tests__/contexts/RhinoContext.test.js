import {
  act,
  render,
  renderHook,
  screen,
  waitFor
} from '@testing-library/react';
import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { NetworkingMock } from '../shared/mock';
import { RhinoProvider, useRhinoContext } from '../..';

vi.mock('axios');
const networkingMock = new NetworkingMock();
axios.mockImplementation(networkingMock.axiosMockImplementation());

describe('RhinoContext', () => {
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

  test('Sets user, baseOwner and usersRoles when sessionQuery is successful', async () => {
    networkingMock.mockValidateSessionSuccess(user);
    const { result } = renderHook(() => useRhinoContext(), {
      wrapper: Wrapper
    });

    await waitFor(() => expect(result.current.user).toEqual(user));
    expect(result.current.baseOwner).toEqual(user);
    expect(result.current.usersRoles).toEqual([]);
  });

  test('Sets user, baseOwner and usersRoles when sessionQuery is failure', async () => {
    networkingMock.mockValidateSessionFailure(user);
    const { result } = renderHook(() => useRhinoContext(), {
      wrapper: Wrapper
    });

    await waitFor(() => expect(result.current.user).toBeNull());
    expect(result.current.baseOwner).toBeNull();
    expect(result.current.usersRoles).toEqual([]);
  });

  test('Does not clean user when already logged in and session is refetched', async () => {
    networkingMock.mockValidateSessionSuccess(user);
    const { result } = renderHook(() => useRhinoContext(), {
      wrapper: Wrapper
    });

    await waitFor(() => expect(result.current.user).toEqual(user));
    expect(result.current.baseOwner).toEqual(user);

    await act(async () => {
      await queryClient.refetchQueries({ queryKey: ['session'] });
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(user);
    });
    expect(result.current.baseOwner).toEqual(user);
    expect(result.current.usersRoles).toEqual([]);
  });

  test('Cleans user when already logged in and session fails in refetching', async () => {
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

  test('Renders children when authenticated (after suspense resolves)', async () => {
    networkingMock.mockValidateSessionSuccess(user);

    const { asFragment } = render(<Wrapper>Should render</Wrapper>);
    await screen.findByText('Should render');
    expect(asFragment()).toMatchSnapshot();
  });

  test('Renders children when not authenticated (after suspense resolves)', async () => {
    networkingMock.mockValidateSessionFailure(user);

    const { asFragment } = render(<Wrapper>Should not render</Wrapper>);
    await waitFor(() => expect(screen.queryByText('Rhino Context')).toBeNull());
    expect(asFragment()).toMatchSnapshot();
  });
});
