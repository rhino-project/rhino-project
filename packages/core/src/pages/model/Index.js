import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import ModelIndex from 'rhino/components/models/ModelIndex';
import ModelPage from './ModelPage';
import { useBaseOwnerId } from 'rhino/hooks/owner';
import { getBaseOwnerFilters } from 'rhino/utils/models';

const Index = (props) => {
  const { model, title } = props;
  const baseOwnerId = useBaseOwnerId();
  const filter = useMemo(() => getBaseOwnerFilters(model, baseOwnerId), [
    model,
    baseOwnerId
  ]);

  return (
    <ModelPage title={title || model.pluralReadableName} {...props}>
      <ModelIndex {...props} filter={filter} />
    </ModelPage>
  );
};

Index.propTypes = {
  baseFilter: PropTypes.object,
  model: PropTypes.object.isRequired,
  parent: PropTypes.object,
  title: PropTypes.string
};

export default Index;
