import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { createWrapper } from '../../shared/helpers';
import { ApplicationShell } from '../../../components/shells';
import { sharedGlobalTests } from '../../shared/sharedGlobalTests';
import { ModelNavSection } from '../../../components/nav';
import { AccountMenu, BaseOwnerSwitcher } from '../../../components/app';

vi.mock('../../../hooks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRoles: vi.fn().mockReturnValue(['admin'])
  };
});

describe('ApplicationShell', () => {
  const Wrapper = ({ children, ...props }) => {
    const queryClient = new QueryClient();

    return (
      <MemoryRouter {...props}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/:baseOwnerId/*" element={<>{children}</>} />
          </Routes>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

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
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
