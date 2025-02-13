import PropTypes from 'prop-types';

import { ModelEdit } from '../../components/models/ModelEdit';
import { ModelPage } from './ModelPage';
import { useParams } from '@tanstack/react-router';

export const Edit = ({ model }) => {
  const { id } = useParams({ strict: false });

  return (
    <ModelPage>
      <ModelEdit model={model} modelId={id} />
    </ModelPage>
  );
};

Edit.propTypes = {
  model: PropTypes.object.isRequired
};
