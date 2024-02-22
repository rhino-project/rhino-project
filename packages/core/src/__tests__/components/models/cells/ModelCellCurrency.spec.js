import { render } from '@testing-library/react';
import ModelCellCurrency from 'rhino/components/models/cells/ModelCellCurrency';
import { sharedCellTests } from './sharedCellTests';

describe('ModelCellCurrency', () => {
  sharedCellTests(ModelCellCurrency);

  it(`formats a positive number`, () => {
    const getValue = () => 20;

    const { asFragment } = render(
      <ModelCellCurrency
        model={{
          properties: {
            dummy: { type: 'float' }
          }
        }}
        path="dummy"
        getValue={getValue}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`formats a negative number`, () => {
    const getValue = () => -15;

    const { asFragment } = render(
      <ModelCellCurrency
        model={{
          properties: {
            dummy: { type: 'float' }
          }
        }}
        path="dummy"
        getValue={getValue}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
