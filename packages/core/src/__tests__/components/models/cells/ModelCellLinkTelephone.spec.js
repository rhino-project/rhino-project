import { render } from '@testing-library/react';
import { sharedCellTests } from './sharedCellTests';
import ModelCellLinkTelephone from '../../../../../rhino/components/models/cells/ModelCellLinkTelephone';

describe('ModelCellLinkTelephone', () => {
  sharedCellTests(ModelCellLinkTelephone);

  it('renders custom link text', () => {
    const { asFragment } = render(
      <ModelCellLinkTelephone getValue={() => '(231) 232-2334'}>
        Click here to call
      </ModelCellLinkTelephone>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the phone number as link text', () => {
    const { asFragment } = render(
      <ModelCellLinkTelephone getValue={() => '(231) 232-2334'} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
