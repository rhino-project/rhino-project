import { render } from '@testing-library/react';
import ModelCellAttachment from '../../../../components/models/cells/ModelCellAttachment';
import { sharedCellTests } from './sharedCellTests';

describe('ModelCellAttachment', () => {
  sharedCellTests(ModelCellAttachment);

  it(`uses url for link text as fallback`, () => {
    const getValue = () => ({
      url: 'https://example.com/image.png'
    });

    const { asFragment } = render(
      <ModelCellAttachment
        model={{
          properties: {
            dummy: {
              type: 'reference'
            }
          }
        }}
        path="dummy"
        getValue={getValue}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`uses display_name for link text`, () => {
    const getValue = () => ({
      display_name: 'foo',
      url: 'https://example.com/image.png'
    });

    const { asFragment } = render(
      <ModelCellAttachment
        model={{
          properties: {
            dummy: {
              type: 'reference'
            }
          }
        }}
        alt="foo"
        path="dummy"
        getValue={getValue}
      >
        foo
      </ModelCellAttachment>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
