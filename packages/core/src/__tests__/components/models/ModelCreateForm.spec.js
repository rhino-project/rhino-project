import ModelCreateForm from '../../../components/models/ModelCreateForm';
import ModelCreateSimple from '../../../components/models/ModelCreateSimple';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import rhinoConfig from 'rhino.config';

vi.mock('rhino/utils/models', async () => {
  const actual = await vi.importActual('rhino/utils/models');
  return {
    ...actual,
    getParentModel: vi.fn().mockReturnValue('user')
  };
});
vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({
  version: 1,
  components: {}
});

describe('ModelCreateForm', () => {
  const wrapper = ({ children }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  sharedModelTests(ModelCreateForm);

  it(`should allow paths to be directly overridden`, async () => {
    const { asFragment } = render(
      <ModelCreateSimple model="blog" fallback={false}>
        <ModelCreateForm paths={['title']} />
      </ModelCreateSimple>,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
