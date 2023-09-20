import React from 'react';
import { renderHook } from '@testing-library/react';
import { AuthContext } from 'rhino/contexts/AuthContext';
import {
  useAuth,
  useAuthenticated,
  useUser,
  useUserId
} from 'rhino/hooks/auth';

const wrapper =
  (context) =>
  ({ children }) => (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );

const validContext = {
  resolving: true,
  user: { id: 1, name: '' }
};

const nullishContext = {
  resolving: false,
  user: null
};

describe('useAuth', () => {
  test('exposes AuthContext', () => {
    const context = validContext;
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapper(context)
    });
    expect(result.current).toEqual(context);
  });

  test('exposes AuthContext when user is null', () => {
    const context = nullishContext;
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapper(context)
    });
    expect(result.current).toEqual(context);
  });
});

describe('useUser', () => {
  test('exposes user from AuthContext when user is valid', () => {
    const context = validContext;
    const { result } = renderHook(() => useUser(), {
      wrapper: wrapper(context)
    });
    expect(result.current).toEqual(context.user);
  });

  test('exposes user from AuthContext when user is null', () => {
    const context = {
      resolving: true,
      user: null
    };
    const { result } = renderHook(() => useUser(), {
      wrapper: wrapper(context)
    });
    expect(result.current).toBeNull();
  });
});

describe('useAuthenticated', () => {
  test('returns true when there is an user in AuthContext', () => {
    const context = validContext;
    const { result } = renderHook(() => useAuthenticated(), {
      wrapper: wrapper(context)
    });
    expect(result.current).toBe(true);
  });

  test('returns false when there is an user in AuthContext', () => {
    const context = {
      resolving: true,
      user: null
    };
    const { result } = renderHook(() => useAuthenticated(), {
      wrapper: wrapper(context)
    });
    expect(result.current).toBe(false);
  });
});

describe('useUserId', () => {
  test('returns the user id when there is an user in AuthContext', () => {
    const context = validContext;
    const { result } = renderHook(() => useUserId(), {
      wrapper: wrapper(context)
    });
    expect(result.current).toBe(context.user.id);
  });

  test('returns null when there is no user in AuthContext', () => {
    const context = {
      resolving: true,
      user: null
    };
    const { result } = renderHook(() => useUser(), {
      wrapper: wrapper(context)
    });
    expect(result.current).toBeNull();
  });
});
