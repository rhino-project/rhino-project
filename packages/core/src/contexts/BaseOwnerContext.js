import { useUser } from 'rhino/hooks/auth';
import { useModelShow } from 'rhino/hooks/queries';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { hasOrganizationsModule } from 'rhino/utils/models';
import { SplashScreen } from 'rhino/components/logos';
import { useBaseOwnerNavigation } from 'rhino/hooks/history';
import { useRootPath } from 'rhino/hooks/routes';
import { BaseOwnerContext, useBaseOwnerId } from '../hooks/owner';

const BaseOwnerProvider = ({ children }) => {
  const user = useUser();
  const baseOwnerId = useBaseOwnerId();
  const baseOwnerNavigation = useBaseOwnerNavigation();
  const rootPath = useRootPath();
  const [baseOwner, setBaseOwner] = useState(null);
  const [resolving, setResolving] = useState(true);
  const [usersRoles, setUsersRoles] = useState([]);

  const {
    isSuccess,
    isInitialLoading,
    resource: account
  } = useModelShow('account', null, { queryOptions: { enabled: !!user } });

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
          baseOwnerNavigation.push(rootPath, usersRoles[0].organization.id);
        } else {
          setBaseOwner(usersRoleFromUrl.organization);
        }
      } else {
        // non-org case
        setUsersRoles([]);
        setBaseOwner(user);
        if (baseOwnerId !== user.id) {
          baseOwnerNavigation.push(rootPath, user.id);
        }
      }
      setResolving(false);
    } else if (isInitialLoading) {
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
