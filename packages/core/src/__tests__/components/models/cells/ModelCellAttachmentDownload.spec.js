import { render } from '@testing-library/react';
import ModelCellAttachment from 'rhino/components/models/cells/ModelCellAttachment';
import ModelCellAttachmentDownload from 'rhino/components/models/cells/ModelCellAttachmentDownload';
import { sharedCellTests } from './sharedCellTests';

describe('ModelCellAttachmentDownload', () => {
  sharedCellTests(ModelCellAttachmentDownload);

  it(`uses url for link text as fallback`, () => {
    const getValue = () => ({
      url_attachment: 'https://example.com/image.png'
    });

    const { asFragment } = render(
      <ModelCellAttachmentDownload
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
      url_attachment: 'https://example.com/image.png'
    });

    const { asFragment } = render(
      <ModelCellAttachmentDownload
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
      </ModelCellAttachmentDownload>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
