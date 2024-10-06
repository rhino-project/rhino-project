import React from 'react';

import { getBaseOwnedModels } from '@rhino-project/core/utils';

import { BaseAuthedPage } from '@rhino-project/core/pages';
import { Empty } from '@rhino-project/core/components/empties';
import { LinkButton } from '@rhino-project/core/components/buttons';
import { useBaseOwnerPath } from '@rhino-project/core/hooks';
import { useUser } from '@rhino-project/core/hooks';
import { useBaseOwner } from '@rhino-project/core/hooks';
import { getModelIndexPath } from '@rhino-project/core/utils';

const APPROVAL = false;

// FIXME Add back session tracking for approval
const Approval = () => {
  return (
    <Empty
      title="Admin Approval Required"
      description="Please contact admin@example.com"
    >
      <LinkButton color="primary" href="mailto:admin@example.com">
        Request Approval
      </LinkButton>
    </Empty>
  );
};

const GetStarted = () => {
  const firstModel = getBaseOwnedModels()?.[0];
  const baseOwnerPath = useBaseOwnerPath();

  const firstPath = firstModel
    ? baseOwnerPath.build(getModelIndexPath(firstModel))
    : null;
  const user = useUser();
  const baseOwner = useBaseOwner();

  return (
    <Empty title={`Welcome to ${baseOwner?.name}, ${user.name || user.uid}`}>
      {firstPath && (
        <LinkButton color="primary" to={firstPath}>
          Get Started
        </LinkButton>
      )}
    </Empty>
  );
};

const DashboardPage = () => {
  return (
    <BaseAuthedPage>{APPROVAL ? <Approval /> : <GetStarted />}</BaseAuthedPage>
  );
};

export default DashboardPage;
