import ModelCellArrayReference from 'rhino/components/models/cells/ModelCellArrayReference';
import { sharedCellTests } from './sharedCellTests';
import { render } from '@testing-library/react';

describe('ModelCellArrayReference', () => {
  sharedCellTests(ModelCellArrayReference);

  it('should render with an accessor string', () => {
    const { asFragment } = render(
      <ModelCellArrayReference
        accessor="another_field"
        getValue={() => [
          {
            another_field: 'foo value'
          },
          {
            another_field: 'bar value'
          }
        ]}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with an accessor function', () => {
    const { asFragment } = render(
      <ModelCellArrayReference
        accessor={() => 'function value'}
        getValue={() => [{}, {}]}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
