import { render } from '@testing-library/react';
import Root from '../../Root';
import DashboardPage from '../../pages/DashboardPage';

describe('DashboardPage', () => {
  it('should render without crashing', () => {
    const { asFragment } = render(
      <Root>
        <DashboardPage />
      </Root>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
