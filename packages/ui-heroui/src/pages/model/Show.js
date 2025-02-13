import PropTypes from 'prop-types';
import { useParams } from '@tanstack/react-router';

import { ModelPage } from './ModelPage';
import { ModelShow } from '../../components/models/ModelShow';

export const Show = ({ model }) => {
  const { id } = useParams({ strict: false });

  return (
    <ModelPage>
      <ModelShow model={model} modelId={id} />
    </ModelPage>
  );
};

Show.propTypes = {
  model: PropTypes.object.isRequired
};
