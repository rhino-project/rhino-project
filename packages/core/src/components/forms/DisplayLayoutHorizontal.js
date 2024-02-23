import { Col, FormGroup } from 'reactstrap';

import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';
import Field from './fields/FieldInput';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import DisplayLabel from './DisplayLabel';

const INHERITED_PROP_OPTIONS = { prefix: 'DisplayLayoutHorizontal' };

const defaultComponents = {
  FormGroup,
  DisplayLabel,
  // FIXME: Should be a basic Display not Field
  Display: Field
};

export const DisplayLayoutHorizontalBase = ({ overrides, ...props }) => {
  const { FormGroup, DisplayLabel, Display } = useOverrides(
    defaultComponents,
    overrides
  );

  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    INHERITED_PROP_OPTIONS
  );

  return (
    <FormGroup {...extractedProps} row {...inheritedProps}>
      <DisplayLabel sm={2} {...inheritedProps} />
      <Col>
        <Display {...inheritedProps} />
      </Col>
    </FormGroup>
  );
};

const DisplayLayoutHorizontal = (props) =>
  useGlobalComponent(
    'DisplayLayoutHorizontal',
    DisplayLayoutHorizontalBase,
    props
  );

export default DisplayLayoutHorizontal;
