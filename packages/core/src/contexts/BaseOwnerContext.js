import { useUser } from 'rhino/hooks/auth';
import { useModelShow } from 'rhino/hooks/queries';
import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { hasOrganizationsModule } from 'rhino/utils/models';
import { SplashScreen } from 'rhino/components/logos';
import { useBaseOwnerNavigation } from 'rhino/hooks/history';
import { useBaseOwnerId } from 'rhino/hooks/owner';
import routePaths from 'rhino/routes';

export const BaseOwnerContext = createContext({
  baseOwner: null,
  resolving: true,
  usersRoles: []
});

const BaseOwnerProvider = ({ children }) => {
  const user = useUser();
  const baseOwnerId = useBaseOwnerId();
  const baseOwnerNavigation = useBaseOwnerNavigation();
  const [baseOwner, setBaseOwner] = useState(null);
  const [resolving, setResolving] = useState(true);
  const [usersRoles, setUsersRoles] = useState([]);

  const { isSuccess, isLoading, resource: account } = useModelShow(
    'account',
    null,
    { queryOptions: { enabled: !!user } }
  );

  useEffect(() => {
    if (isSuccess && user) {
      if (hasOrganizationsModule()) {
        const usersRoles = account?.users_roles ?? [];
        setUsersRoles(usersRoles);
        const usersRoleFromUrl = usersRoles.find(
          (el) => el.organization.id === baseOwnerId
        );
        if (usersRoleFromUrl == null) {
          // if there's no match for the base owner id in the url,
          // we set the first base owner found
          // and navigate to its root url
          const anyBaseOwner = usersRoles[0];
          setBaseOwner(anyBaseOwner.organization);
          baseOwnerNavigation.push(
            routePaths.rootpath(),
            usersRoles[0].organization.id
          );
        } else {
          setBaseOwner(usersRoleFromUrl.organization);
        }
      } else {
        // non-org case
        setUsersRoles([]);
        setBaseOwner(user);
        if (baseOwnerId !== user.id) {
          baseOwnerNavigation.push(routePaths.rootpath(), user.id);
        }
      }
      setResolving(false);
    } else if (isLoading) {
      setResolving(true);
    } else {
      setResolving(false);
      setBaseOwner(null);
      setUsersRoles([]);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [isSuccess, user, baseOwnerId]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <BaseOwnerContext.Provider
      value={{
        baseOwner,
        resolving,
        usersRoles
      }}
    >
      {baseOwner ? children : <SplashScreen />}
    </BaseOwnerContext.Provider>
  );
};

BaseOwnerProvider.propTypes = {
  children: PropTypes.node
};

export default BaseOwnerProvider;
