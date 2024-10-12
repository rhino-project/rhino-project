import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { createWrapper } from '../../shared/helpers';
import { sharedGlobalTests } from '../../shared/sharedGlobalTests';
import { ModelNavSection } from '../../../components/nav';

vi.mock('../../../hooks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRoles: vi.fn().mockReturnValue(['admin'])
  };
});

describe('ModelNavSection', () => {
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

  sharedGlobalTests(ModelNavSection);

  it('renders without crashing', () => {
    const { asFragment } = render(<ModelNavSection />, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays models passed as string of arrays', () => {
    const { asFragment } = render(<ModelNavSection models={['user']} />, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays models returned from function as string of arrays', () => {
    const models = () => ['user'];
    const { asFragment } = render(<ModelNavSection models={models} />, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays models passed as an object', () => {
    const { asFragment } = render(
      <ModelNavSection models={{ admin: ['blog'] }} />,
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays models returned from function as an object', () => {
    const models = () => ['blog'];
    const { asFragment } = render(<ModelNavSection models={models} />, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
