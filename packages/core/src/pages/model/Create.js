import PropTypes from 'prop-types';

import { useParsedSearch } from 'rhino/hooks/history';
import ModelCreate from 'rhino/components/models/ModelCreate';
import ModelPage from './ModelPage';

const Create = ({ model }) => {
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

export default Create;
