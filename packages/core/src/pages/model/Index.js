import PropTypes from 'prop-types';

import ModelIndex from '../../components/models/ModelIndex';
import ModelPage from './ModelPage';

export const Index = (props) => {
  const { model, title } = props;

  return (
    <ModelPage title={title || model.pluralReadableName}>
      <ModelIndex {...props} />
    </ModelPage>
  );
};

Index.propTypes = {
  model: PropTypes.object.isRequired,
  title: PropTypes.string
};
