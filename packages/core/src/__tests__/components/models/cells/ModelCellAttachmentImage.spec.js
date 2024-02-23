import { render } from '@testing-library/react';
import { ModelCellAttachmentImage } from '../../../../components/models/cells/ModelCellAttachmentImage';
import { sharedCellTests } from './sharedCellTests';

describe('ModelCellAttachmentImage', () => {
  const getValue = () => ({
    url: 'https://example.com/image.png'
  });

  sharedCellTests(ModelCellAttachmentImage);

  it(`uses url for alt as fallback`, () => {
    const { asFragment } = render(
      <ModelCellAttachmentImage
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

  it(`uses passed in alt`, () => {
    const { asFragment } = render(
      <ModelCellAttachmentImage
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
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
