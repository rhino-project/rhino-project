import { render } from '@testing-library/react';
import ModelCellEnum from 'rhino/components/models/cells/ModelCellEnum';
import { sharedCellTests } from './sharedCellTests';

describe('ModelCellEnum', () => {
  sharedCellTests(ModelCellEnum);

  it(`adds style as a prop based on matched enum value`, () => {
    const getValue = () => 'bar';

    const { asFragment } = render(
      <ModelCellEnum
        model={{
          properties: {
            dummy: {
              type: 'string',
              enum: ['foo', 'bar']
            }
          }
        }}
        path="dummy"
        getValue={getValue}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`uses default style value if match is not found`, () => {
    const getValue = () => 'baz';

    const { asFragment } = render(
      <ModelCellEnum
        model={{
          properties: {
            dummy: {
              type: 'string',
              enum: ['foo', 'bar']
            }
          }
        }}
        path="dummy"
        getValue={getValue}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
