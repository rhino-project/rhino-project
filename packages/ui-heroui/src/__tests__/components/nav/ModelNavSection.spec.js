import { render } from '@testing-library/react';
import { createWrapper, RouterWrapper } from '../../shared/helpers';
import { sharedGlobalTests } from '../../shared/sharedGlobalTests';
import { ModelNavSection } from '../../../components/nav';

vi.mock('@rhino-project/core/hooks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRoles: vi.fn().mockReturnValue(['admin'])
  };
});

describe('ModelNavSection', () => {
  sharedGlobalTests(ModelNavSection);

  it('renders without crashing', () => {
    const { asFragment } = render(<ModelNavSection />, {
      wrapper: createWrapper(RouterWrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays models passed as string of arrays', () => {
    const { asFragment } = render(<ModelNavSection models={['user']} />, {
      wrapper: createWrapper(RouterWrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays models returned from function as string of arrays', () => {
    const models = () => ['user'];
    const { asFragment } = render(<ModelNavSection models={models} />, {
      wrapper: createWrapper(RouterWrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays models passed as an object', () => {
    const { asFragment } = render(
      <ModelNavSection models={{ admin: ['blog'] }} />,
      {
        wrapper: createWrapper(RouterWrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays models returned from function as an object', () => {
    const models = () => ['blog'];
    const { asFragment } = render(<ModelNavSection models={models} />, {
      wrapper: createWrapper(RouterWrapper, {
        initialEntries: ['/1']
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
