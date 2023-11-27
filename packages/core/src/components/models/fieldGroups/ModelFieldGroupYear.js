import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import FieldGroupYear, {
  FieldGroupFloatingYear,
  FieldGroupHorizontalYear
} from 'rhino/components/forms/fieldGroups/FieldGroupYear';
import { useModelFieldGroup } from 'rhino/hooks/form';

export const ModelFieldGroupYearVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupYear {...fieldGroupProps} />;
};

ModelFieldGroupYearVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalYear = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalYear {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingYear = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingYear {...fieldGroupProps} />;
};

const ModelFieldGroupYear = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupYear',
    ModelFieldGroupYearVertical,
    props
  );

export default ModelFieldGroupYear;
