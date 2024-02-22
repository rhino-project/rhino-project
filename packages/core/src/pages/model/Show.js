import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import ModelPage from './ModelPage';
import ModelShow from '../../components/models/ModelShow';

const Show = ({ model }) => {
  const { id } = useParams();

  return (
    <ModelPage>
      <ModelShow model={model} modelId={id} />
    </ModelPage>
  );
};

Show.propTypes = {
  model: PropTypes.object.isRequired
};

export default Show;
