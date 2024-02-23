import PropTypes from 'prop-types';

import { useParsedSearch } from '../../hooks/history';
import ModelCreate from '../../components/models/ModelCreate';
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
