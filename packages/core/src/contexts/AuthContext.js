import { networkApiCall } from 'rhino/lib/networking';
import PropTypes from 'prop-types';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useQuery } from 'react-query';
import {
  AUTH_SESSION_KEY,
  AUTH_VALIDATE_TOKEN_END_POINT
} from 'rhino/lib/networking';
import { useRollbarPerson } from '@rollbar/react';

const useSession = () => {
  return useQuery(
    AUTH_SESSION_KEY,
    ({ signal }) => networkApiCall(AUTH_VALIDATE_TOKEN_END_POINT, { signal }),
    {
      retry: false
    }
  );
};

export const AuthContext = createContext({
  user: null,
  baseOwner: null,
  resolving: true
});

const AuthProvider = ({ children }) => {
  const sessionQuery = useSession();
  const {
    isError,
    isLoading,
    isFetching,
    isSuccess,
    data,
    refetch
  } = sessionQuery;
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  useRollbarPerson(user);

  useEffect(() => {
    if (isSuccess || isError) {
      setInitializing(false);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccess && data.data.data) {
      setUser(data.data.data);
    } else if (isError) {
      setUser(null);
    }
  }, [isError, isLoading, isSuccess, data]);

  const logOut = useCallback(() => {
    setUser(null);
  }, []);

  const logIn = useCallback((user) => {
    setUser(user);
  }, []);

  const value = useMemo(
    () => ({
      user,
      resolving: isFetching,
      initializing,
      logOut,
      logIn,
      refreshSession: refetch
    }),
    [user, initializing, logOut, logIn, refetch, isFetching]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export default AuthProvider;
