import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useBackHistory } from 'rhino/hooks/history';
import ModelEdit from 'rhino/components/models/ModelEdit';
import ModelPage from './ModelPage';
import { useParams } from 'react-router';

const Edit = ({ model }) => {
  const backHistory = useBackHistory();
  const handleActionSuccess = () => backHistory();
  const { id } = useParams();
  const resource = useMemo(() => ({ id }), [id]);

  return (
    <ModelPage>
      <ModelEdit
        model={model}
        resource={resource}
        onActionSuccess={handleActionSuccess}
      />
    </ModelPage>
  );
};

Edit.propTypes = {
  model: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
