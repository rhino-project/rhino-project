import PropTypes from 'prop-types';

import ModelEdit from 'rhino/components/models/ModelEdit';
import ModelPage from './ModelPage';
import { useParams } from 'react-router';

const Edit = ({ model }) => {
  const { id } = useParams();

  return (
    <ModelPage>
      <ModelEdit model={model} modelId={id} />
    </ModelPage>
  );
};

Edit.propTypes = {
  model: PropTypes.object.isRequired
};

export default Edit;
