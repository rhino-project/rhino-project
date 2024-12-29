import { render } from '@testing-library/react';
import { ModelCellBooleanIcon } from '../../../../components/models/cells/ModelCellBooleanIcon';
import { sharedCellTests } from './sharedCellTests';

describe('ModelCellBooleanIcon', () => {
  sharedCellTests(ModelCellBooleanIcon);

  it('renders true icon', () => {
    const { asFragment } = render(
      <ModelCellBooleanIcon getValue={() => true} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders false icon', () => {
    const { asFragment } = render(
      <ModelCellBooleanIcon getValue={() => false} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty icon', () => {
    const { asFragment } = render(
      <ModelCellBooleanIcon getValue={() => null} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders custom class', () => {
    const { asFragment } = render(
      <ModelCellBooleanIcon getValue={() => true} className="customClass" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
