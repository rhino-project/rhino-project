import { render } from '@testing-library/react';
import { createWrapper, RouterWrapper } from '../../shared/helpers';
import { ApplicationShell } from '../../../components/shells';
import { sharedGlobalTests } from '../../shared/sharedGlobalTests';
import { ModelNavSection } from '../../../components/nav';
import { AccountMenu, BaseOwnerSwitcher } from '../../../components/app';

describe('ApplicationShell', () => {
  sharedGlobalTests(ApplicationShell);

  it('renders without crashing', () => {
    const { asFragment } = render(
      <ApplicationShell
        primaryNavigationElement={<ModelNavSection />}
        secondaryNavigationElement={
          <div>
            <BaseOwnerSwitcher />
            <AccountMenu />
          </div>
        }
      />,
      {
        wrapper: createWrapper(RouterWrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
