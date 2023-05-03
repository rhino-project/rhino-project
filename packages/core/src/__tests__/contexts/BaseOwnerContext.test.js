import { renderHook } from '@testing-library/react-hooks/dom';
import { useContext } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import routePaths from 'rhino/routes';
import BaseOwnerProvider from 'rhino/contexts/BaseOwnerContext';
import { BaseOwnerContext } from 'rhino/hooks/owner';

let mockUser;
jest.mock('rhino/hooks/auth', () => ({
  useUser: jest.fn(() => mockUser)
}));

let mockBaseOwnerId;
const mockUseBaseOwnerId = jest.fn(() => mockBaseOwnerId);
jest.mock('rhino/hooks/owner', () => {
  const originalModule = jest.requireActual('rhino/hooks/owner');
  return {
    ...originalModule,
    useBaseOwnerId: jest.fn(() => mockUseBaseOwnerId())
  };
});

let mockUseBaseOwnerNavigationPushFn = jest.fn(() => {});
jest.mock('rhino/hooks/history', () => ({
  useBaseOwnerNavigation: () => ({
    push: mockUseBaseOwnerNavigationPushFn
  })
}));

const mockUseModelShowResult = jest.fn();
const mockUseModelShowFn = jest.fn(() => mockUseModelShowResult());
jest.mock('rhino/hooks/queries', () => ({
  useModelShow: jest.fn(() => mockUseModelShowFn())
}));

let mockHasOrganizationsModule;
jest.mock('rhino/utils/models', () => ({
  hasOrganizationsModule: jest.fn(() => mockHasOrganizationsModule),
  getModel: () => ({})
}));

describe('BaseOwnerContext', () => {
  const user = { id: 1, name: '', email: '' };
  const firstBaseOwner = { id: 55 };
  const secondBaseOwner = { id: 77 };
  const firstUsersRole = { organization: firstBaseOwner, role: {} };
  const secondUsersRole = { organization: secondBaseOwner, role: {} };
  const usersRoles = [firstUsersRole, secondUsersRole];
  const account = {
    ...user,
    users_roles: usersRoles
  };
  const successShowQueryResult = {
    isLoading: false,
    isSuccess: true,
    data: {
      data: account
    },
    resource: account
  };
  const failureShowQueryResult = {
    isFailure: true
  };

  let result;
  let rerender;

  // eslint-disable-next-line react/prop-types
  function Wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    return (
      <QueryClientProvider client={queryClient}>
        <BaseOwnerProvider>{children}</BaseOwnerProvider>
      </QueryClientProvider>
    );
  }

  function startWithLoading(user = {}) {
    mockUser = user;
    mockUseModelShowResult.mockImplementation(() => ({}));
    const { result, rerender } = renderHook(
      () => useContext(BaseOwnerContext),
      {
        wrapper: Wrapper
      }
    );
    expect(result.current).toBe(undefined);

    mockUseModelShowResult.mockImplementation(() => ({
      isLoading: true
    }));
    rerender();
    expect(result.current).toBe(undefined);
    return { result, rerender };
  }

  function emitSuccessResult(args = {}) {
    const defaults = {
      mockBaseOwnerId: secondBaseOwner.id,
      mockUser: user
    };
    mockUseModelShowResult.mockImplementation(() => ({
      ...successShowQueryResult,
      ...args
    }));
    mockBaseOwnerId =
      'mockBaseOwnerId' in args
        ? args.mockBaseOwnerId
        : defaults.mockBaseOwnerId;
    mockUser = 'mockUser' in args ? args.mockUser : defaults.mockUser;
  }

  function emitFailureResult() {
    mockUseModelShowResult.mockImplementation(() => failureShowQueryResult);
  }

  describe('multi org environment', () => {
    beforeEach(() => {
      mockHasOrganizationsModule = true;
      mockUser = {};
      const hook = startWithLoading();
      result = hook.result;
      rerender = hook.rerender;
    });

    test('Does not render children while no baseOwner is set', async () => {
      expect(result.current).toBe(undefined);
    });

    test('Emits context normally when there is a valid baseOwner', async () => {
      // successful request
      emitSuccessResult();
      rerender();

      // emits first base owner
      expect(result.current).toEqual({
        baseOwner: secondBaseOwner,
        resolving: false,
        usersRoles
      });
    });

    test('Sets resolving to true and keeps rendering children when a reload starts after a successful request', async () => {
      // successful request
      emitSuccessResult();
      rerender();

      // reload starts
      mockUseModelShowResult.mockImplementation(() => ({
        isLoading: true
      }));
      rerender();

      // keeps rendering children, emitting the same baseOwner and sets resolving to true
      expect(result.current).toEqual({
        baseOwner: secondBaseOwner,
        resolving: true,
        usersRoles
      });
    });

    test('Does not render children when failure', async () => {
      emitFailureResult();
      rerender();
      // BaseOwnerProvider only renders children when successful, so the useContext hook rendered inside BaseOwnerProvider doesn't run and we don't get any context
      expect(result.current).toBe(undefined);
    });

    test('Sets baseOwner to the first one in the list when useBaseOwnerId is null', async () => {
      // successful request returning null as base owner id
      emitSuccessResult({ mockBaseOwnerId: null });
      rerender();

      // firstBaseOwner gets picked up
      expect(result.current).toEqual({
        baseOwner: firstBaseOwner,
        resolving: false,
        usersRoles
      });
    });

    test('Sets baseOwner to the first one in the list when useBaseOwnerId is not present in the baseOwners list', async () => {
      // successful request returning an invalid base owner id
      emitSuccessResult({ mockBaseOwnerId: 999999999 });
      rerender();

      // firstBaseOwner gets picked up
      expect(result.current).toEqual({
        baseOwner: firstBaseOwner,
        resolving: false,
        usersRoles
      });
    });

    test('Navigates if the resolved baseOwner is different from useBaseOwnerId', async () => {
      // successful request returning an invalid base owner id
      emitSuccessResult({ mockBaseOwnerId: 999999999 });
      rerender();

      // navigates using the firstBaseOwner id
      expect(mockUseBaseOwnerNavigationPushFn).toHaveBeenLastCalledWith(
        routePaths.rootpath(),
        firstBaseOwner.id
      );
    });

    test('Sets baseOwner to the baseOwner that has same id as useBaseOwnerId', async () => {
      // successful request returning the secondBaseOwner id
      emitSuccessResult({ mockBaseOwnerId: secondBaseOwner.id });
      rerender();

      // secondBaseOwner gets picked up
      expect(result.current).toEqual({
        baseOwner: secondBaseOwner,
        resolving: false,
        usersRoles
      });

      // successful request returning the firstBaseOwner id
      emitSuccessResult({ mockBaseOwnerId: firstBaseOwner.id });
      rerender();

      // firstBaseOwner gets picked up
      expect(result.current).toEqual({
        baseOwner: firstBaseOwner,
        resolving: false,
        usersRoles
      });
    });
  });

  describe('non-org environment', () => {
    beforeEach(() => {
      mockHasOrganizationsModule = false;
      mockUser = { id: 777 };
      const hook = startWithLoading();
      result = hook.result;
      rerender = hook.rerender;
    });

    test('Does not render children while no baseOwner is set', async () => {
      expect(result.current).toBe(undefined);
    });

    test('Emits context normally when there is a valid baseOwner', async () => {
      // successful request
      emitSuccessResult();
      rerender();

      // emits first base owner
      expect(result.current).toEqual({
        baseOwner: user,
        resolving: false,
        usersRoles: []
      });
    });

    test('Sets resolving to true and keeps rendering children when a reload starts after a successful request', async () => {
      // successful request
      emitSuccessResult();
      rerender();

      // reload starts
      mockUseModelShowResult.mockImplementation(() => ({
        isLoading: true
      }));
      rerender();

      // keeps rendering children, emitting the same baseOwner and sets resolving to true
      expect(result.current).toEqual({
        baseOwner: user,
        resolving: true,
        usersRoles: []
      });
    });

    test('Does not render children when failure', async () => {
      emitFailureResult();
      rerender();
      // BaseOwnerProvider only renders children when successful, so the useContext hook rendered inside BaseOwnerProvider doesn't run and we don't get any context
      expect(result.current).toBe(undefined);
    });

    test('Sets baseOwner to the user itself', async () => {
      // successful request returning null as base owner id
      emitSuccessResult({ mockBaseOwnerId: null });
      rerender();

      // user is set as base owner
      expect(result.current).toEqual({
        baseOwner: user,
        resolving: false,
        usersRoles: []
      });
    });

    test("Navigates if the base owner id from URL is different as the user's", async () => {
      // successful request returning an invalid base owner id
      emitSuccessResult({
        mockBaseOwnerId: 1,
        mockUser: { ...user, id: 898989 }
      });
      rerender();

      // navigates using the firstBaseOwner id
      expect(mockUseBaseOwnerNavigationPushFn).toHaveBeenLastCalledWith(
        routePaths.rootpath(),
        898989
      );
    });

    test("Does NOT navigate if the base owner id from URL is the same as the user's", async () => {
      // resetting number of calls to this mock
      mockUseBaseOwnerNavigationPushFn = jest.fn(() => {});

      emitSuccessResult({
        mockBaseOwnerId: 898989,
        mockUser: { ...user, id: 898989 }
      });
      rerender();

      // navigates using the firstBaseOwner id
      expect(mockUseBaseOwnerNavigationPushFn).not.toHaveBeenCalled();
    });
  });
});
