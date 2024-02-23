import { renderHook } from '@testing-library/react';
import { createWrapper } from '__tests__/shared/helpers';
import {
  BaseOwnerContext,
  useBaseOwner,
  useBaseOwnerContext,
  useBaseOwnerId,
  useHasRoleOf,
  useRoles,
  useUserRoles,
} from '../../hooks/owner';

const Wrapper = ({ children, ...props }) => (
  <BaseOwnerContext.Provider {...props}>{children}</BaseOwnerContext.Provider>
);

const validContext = {
  resolving: true,
  baseOwner: { id: 1, name: '' },
  usersRoles: [{ organization: { id: 1, name: '' }, role: { name: 'admin' } }]
};

const nullishContext = {
  resolving: false,
  baseOwner: null
};

describe('useBaseOwnerContext', () => {
  test('exposes BaseOwnerContext', () => {
    const context = validContext;
    const { result } = renderHook(() => useBaseOwnerContext(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toEqual(context);
  });

  test('exposes BaseOwnerContext when baseOwner is null', () => {
    const context = nullishContext;
    const { result } = renderHook(() => useBaseOwnerContext(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toEqual(context);
  });
});

describe('useBaseOwner', () => {
  test('exposes baseOwner from BaseOwnerContext when baseOwner is valid', () => {
    const context = validContext;
    const { result } = renderHook(() => useBaseOwner(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toEqual(context.baseOwner);
  });

  test('exposes user from BaseOwnerContext when user is null', () => {
    const context = nullishContext;
    const { result } = renderHook(() => useBaseOwner(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toBeNull();
  });
});

let mockParams;
const mockUseParamsFn = vi.fn(() => mockParams);
vi.mock('react-router-dom', () => ({
  useParams: () => mockUseParamsFn()
}));

describe('useBaseOwnerId', () => {
  test('returns the baseOwner id from useParams', () => {
    mockParams = { baseOwnerId: 55 };
    const { result } = renderHook(() => useBaseOwnerId(), {
      wrapper: Wrapper
    });
    expect(result.current).toBe(55);
  });

  test('returns the baseOwner id from useParams when it is null', () => {
    mockParams = { baseOwnerId: null };
    const { result } = renderHook(() => useBaseOwnerId(), {
      wrapper: Wrapper
    });
    expect(result.current).toBeNaN();
  });

  test('returns NaN as the baseOwner id from useParams when it is absent', () => {
    mockParams = {};
    const { result } = renderHook(() => useBaseOwnerId(), {
      wrapper: Wrapper
    });
    expect(result.current).toBeNaN();
  });
});

describe('useRoles', () => {
  test('returns all roles names if more than one', () => {
    const context = {
      ...validContext,
      baseOwner: { ...validContext.baseOwner },
      usersRoles: [
        { role: { name: 'aa' }, organization: validContext.baseOwner },
        { role: { name: 'bb' }, organization: validContext.baseOwner },
        { role: { name: 'cc' }, organization: validContext.baseOwner }
      ]
    };
    const { result } = renderHook(() => useRoles(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toEqual(['aa', 'bb', 'cc']);
  });

  test('returns the role name if just one', () => {
    const context = validContext;
    const { result } = renderHook(() => useRoles(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toEqual([validContext.usersRoles[0].role.name]);
  });

  test('returns [] if users_roles is undefined', () => {
    const context = {
      ...validContext,
      baseOwner: { ...validContext.baseOwner },
      usersRoles: undefined
    };
    const { result } = renderHook(() => useRoles(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toEqual([]);
  });

  test('returns [] if users_roles.role is undefined', () => {
    const context = {
      ...validContext,
      baseOwner: {
        ...validContext.baseOwner
      },
      usersRoles: {
        role: undefined
      }
    };
    const { result } = renderHook(() => useRoles(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toEqual([]);
  });

  test('filters out non-string values', () => {
    const context = {
      ...validContext,
      baseOwner: {
        ...validContext.baseOwner
      },
      usersRoles: {
        role: {
          name: null
        }
      }
    };
    const { result } = renderHook(() => useRoles(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toEqual([]);
  });
});

describe('useUsersRoles', () => {
  test('returns usersRoles stored in BaseOwnerContext', () => {
    const context = {
      ...validContext,
      baseOwner: { ...validContext.baseOwner },
      usersRoles: [
        { role: { name: 'aa' }, organization: validContext.baseOwner },
        { role: { name: 'bb' }, organization: validContext.baseOwner },
        { role: { name: 'cc' }, organization: validContext.baseOwner }
      ]
    };
    const { result } = renderHook(() => useUserRoles(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toEqual([
      { role: { name: 'aa' }, organization: validContext.baseOwner },
      { role: { name: 'bb' }, organization: validContext.baseOwner },
      { role: { name: 'cc' }, organization: validContext.baseOwner }
    ]);
  });

  test('returns usersRoles stored in BaseOwnerContext, even if empty', () => {
    const context = {
      ...validContext,
      baseOwner: { ...validContext.baseOwner },
      usersRoles: []
    };
    const { result } = renderHook(() => useUserRoles(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toEqual([]);
  });

  test('returns usersRoles stored in BaseOwnerContext, even if undefined', () => {
    const context = {
      ...validContext,
      baseOwner: { ...validContext.baseOwner },
      usersRoles: undefined
    };
    const { result } = renderHook(() => useUserRoles(), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toBeUndefined();
  });
});

describe('useHasRoleOf', () => {
  test('returns true if there is at least one role with the given name when there is more than one role', () => {
    const context = {
      ...validContext,
      baseOwner: { ...validContext.baseOwner },
      usersRoles: [
        { role: { name: 'aa' }, organization: validContext.baseOwner },
        { role: { name: 'bb' }, organization: validContext.baseOwner },
        { role: { name: 'cc' }, organization: validContext.baseOwner }
      ]
    };
    const { result } = renderHook(() => useHasRoleOf('bb'), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toBe(true);
  });

  test('returns true if there is at least one role with the given name when there is just one role', () => {
    const context = {
      ...validContext,
      baseOwner: { ...validContext.baseOwner },
      usersRoles: [
        { role: { name: 'aa' }, organization: validContext.baseOwner }
      ]
    };
    const { result } = renderHook(() => useHasRoleOf('aa'), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toBe(true);
  });

  test('returns false if there is no role with the given name when there is more than one role', () => {
    const context = {
      ...validContext,
      baseOwner: { ...validContext.baseOwner },
      usersRoles: [
        { role: { name: 'aa' }, organization: validContext.baseOwner },
        { role: { name: 'bb' }, organization: validContext.baseOwner },
        { role: { name: 'cc' }, organization: validContext.baseOwner }
      ]
    };
    const { result } = renderHook(() => useHasRoleOf('xx'), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toBe(false);
  });

  test('returns false if there is no role with the given name when there is just one role', () => {
    const context = validContext;
    const { result } = renderHook(() => useHasRoleOf('manager'), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toBe(false);
  });

  test('returns false if usersRoles is undefined', () => {
    const context = {
      ...validContext,
      baseOwner: {
        ...validContext.baseOwner
      },
      usersRoles: undefined
    };
    const { result } = renderHook(() => useHasRoleOf('admin'), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toBe(false);
  });

  test('returns false if usersRoles.role is undefined', () => {
    const context = {
      ...validContext,
      baseOwner: {
        ...validContext.baseOwner
      },
      usersRoles: [{ role: undefined }]
    };
    const { result } = renderHook(() => useHasRoleOf('admin'), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toBe(false);
  });
});
