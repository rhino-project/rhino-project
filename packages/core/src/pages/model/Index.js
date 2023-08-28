import PropTypes from 'prop-types';

import ModelIndex from 'rhino/components/models/ModelIndex';
import ModelPage from './ModelPage';
import { useBaseOwnerFilters } from 'rhino/hooks/owner';

const Index = (props) => {
  const { model, title } = props;
  const filter = useBaseOwnerFilters(model);

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
