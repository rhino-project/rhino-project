import { render } from '@testing-library/react';
import { sharedCellTests } from './sharedCellTests';
import { ModelCellLinkEmail } from '../../../../../rhino/components/models/cells/ModelCellLinkEmail';

describe('ModelCellLinkEmail', () => {
  sharedCellTests(ModelCellLinkEmail);

  it('renders custom link text', () => {
    const { asFragment } = render(
      <ModelCellLinkEmail getValue={() => 'john.doe@email.com'}>
        Click here to send email
      </ModelCellLinkEmail>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the email as link text', () => {
    const { asFragment } = render(
      <ModelCellLinkEmail getValue={() => 'john.doe@email.com'} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
