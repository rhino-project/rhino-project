import ModelCellDateTimeDistance from '../../../../components/models/cells/ModelCellDateTimeDistance';
import { sharedCellTests } from './sharedCellTests';
import { render } from '@testing-library/react';

describe('ModelCellDateTimeDistance', () => {
  sharedCellTests(ModelCellDateTimeDistance);

  const tenMinutesAgoDate = new Date(new Date().getTime() - 10 * 60 * 1000);

  it('renders datetime distance with default baseDate', () => {
    const { asFragment } = render(
      <ModelCellDateTimeDistance
        getValue={() => tenMinutesAgoDate.toISOString()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders datetime distance with baseDate older than value', () => {
    const { asFragment } = render(
      <ModelCellDateTimeDistance
        getValue={() => new Date().toISOString()}
        baseDate={tenMinutesAgoDate}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
