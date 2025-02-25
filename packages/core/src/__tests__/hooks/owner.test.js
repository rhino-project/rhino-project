import { renderHook } from '@testing-library/react';
import { createWrapper } from '../shared/helpers';
import {
  useBaseOwner,
  useBaseOwnerId,
  useHasRoleOf,
  useRoles,
  useUserRoles,
  useUsersRoleWithRole
} from '../../hooks/owner';
import { RhinoContext } from '../..';

const validContext = {
  baseOwner: { id: 1, name: '' },
  usersRoles: [{ organization: { id: 1, name: '' }, role: { name: 'admin' } }]
};

const nullishContext = {
  baseOwner: null
};

const Wrapper = ({ children, ...props }) => {
  return <RhinoContext.Provider {...props}>{children}</RhinoContext.Provider>;
};

describe('useBaseOwner', () => {
  test('exposes baseOwner from RhinoContext when baseOwner is valid', () => {
    const { result } = renderHook(() => useBaseOwner(), {
      wrapper: createWrapper(Wrapper, { value: validContext })
    });
    expect(result.current).toEqual(validContext.baseOwner);
  });

  test('exposes user from RhinoContext when user is null', () => {
    const { result } = renderHook(() => useBaseOwner(), {
      wrapper: createWrapper(Wrapper, { value: nullishContext })
    });
    expect(result.current).toBeNull();
  });
});

describe('useBaseOwnerId', () => {
  test('returns the baseOwner id', () => {
    const { result } = renderHook(() => useBaseOwnerId(), {
      wrapper: createWrapper(Wrapper, { value: validContext })
    });
    expect(result.current).toBe(1);
  });

  test('returns the baseOwner id null', () => {
    const { result } = renderHook(() => useBaseOwnerId(), {
      wrapper: createWrapper(Wrapper, { value: nullishContext })
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
  test('returns usersRoles stored in RhinoContext', () => {
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

  test('returns usersRoles stored in RhinoContext, even if empty', () => {
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

  test('returns usersRoles stored in RhinoContext, even if undefined', () => {
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

describe('useUsersRoleWithRole', () => {
  test('returns matching user role', () => {
    const context = {
      ...validContext,
      baseOwner: { ...validContext.baseOwner },
      usersRoles: [
        { role: { name: 'aa' }, organization: validContext.baseOwner },
        { role: { name: 'bb' }, organization: validContext.baseOwner },
        { role: { name: 'cc' }, organization: validContext.baseOwner }
      ]
    };
    const { result } = renderHook(() => useUsersRoleWithRole('aa'), {
      wrapper: createWrapper(Wrapper, { value: context })
    });
    expect(result.current).toEqual({
      role: { name: 'aa' },
      organization: validContext.baseOwner
    });
  });
});
