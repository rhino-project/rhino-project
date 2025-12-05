import PropTypes from 'prop-types';

import { useParsedSearch } from '@rhino-project/core/hooks';
import { ModelCreate } from '../../components/models/ModelCreate';
import { ModelPage } from './ModelPage';

export const Create = ({ model }) => {
  const { parentId } = useParsedSearch();

  return (
    <ModelPage title={`Create ${model.readableName}`}>
      <ModelCreate model={model} parentId={parentId} />
    </ModelPage>
  );
};

Create.propTypes = {
  model: PropTypes.object.isRequired
};
