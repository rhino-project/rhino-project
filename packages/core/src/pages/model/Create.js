import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { getParentModel } from 'rhino/utils/models';
import { useBackHistory, useParsedSearch } from 'rhino/hooks/history';
import ModelCreate from 'rhino/components/models/ModelCreate';
import ModelPage from './ModelPage';

const Create = ({ model }) => {
  const parentModel = useMemo(() => getParentModel(model), [model]);
  const { [parentModel.model]: parentId } = useParsedSearch();
  const resource = useMemo(() => ({ [parentModel.model]: parentId }), [
    parentModel,
    parentId
  ]);

  const backHistory = useBackHistory();
  const handleActionSuccess = () => backHistory();

  return (
    <ModelPage title={`Create ${model.readableName}`}>
      <ModelCreate
        model={model}
        resource={resource}
        onActionSuccess={handleActionSuccess}
      />
    </ModelPage>
  );
};

Create.propTypes = {
  model: PropTypes.object.isRequired
};

export default Create;
