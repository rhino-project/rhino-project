import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { PrimaryNavigation } from '../../../components/app';
import { createWrapper } from '../../shared/helpers';
import rhinoConfig from 'rhino.config';

vi.mock('../../../hooks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRoles: vi.fn().mockReturnValue(['admin'])
  };
});

describe('PrimaryNavigation', () => {
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

  it('renders without crashing', () => {
    const { asFragment } = render(<PrimaryNavigation />, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('disables model routes', () => {
    const spy = vi
      .spyOn(rhinoConfig, 'enableModelRoutes', 'get')
      .mockImplementation(() => false);

    const { asFragment } = render(<PrimaryNavigation />, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();

    spy.mockRestore();
  });

  it('displays models passed as string of arrays', () => {
    const { asFragment } = render(<PrimaryNavigation models={['user']} />, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays models returned from function as string of arrays', () => {
    const models = () => ['user'];
    const { asFragment } = render(<PrimaryNavigation models={models} />, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays models passed as an object', () => {
    const { asFragment } = render(
      <PrimaryNavigation models={{ admin: ['blog'] }} />,
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays models returned from function as an object', () => {
    const models = () => {
      ['user'];
    };

    const { asFragment } = render(<PrimaryNavigation models={models} />, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
