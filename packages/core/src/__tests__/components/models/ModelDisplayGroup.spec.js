import { render } from '@testing-library/react';
import ModelDisplayGroup from '../../../components/models/ModelDisplayGroup';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModelShowSimple from '../../../components/models/ModelShowSimple';
import * as network from '../../../lib/networking';
import rhinoConfig from 'rhino.config';

vi.spyOn(network, 'networkApiCall').mockReturnValue({
  data: {
    test: 'test'
  }
});

vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({
  version: 1,
  components: {}
});

describe('ModelDisplayGroup', () => {
  const wrapper = ({ children }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    return (
      <QueryClientProvider client={queryClient}>
        <ModelShowSimple model="user" fallback={false}>
          {children}
        </ModelShowSimple>
      </QueryClientProvider>
    );
  };

  const Bar = (props) => <div {...props}>Bar</div>;

  sharedModelTests(ModelDisplayGroup);

  it(`should render without prop`, () => {
    const { asFragment } = render(<ModelDisplayGroup path="name" />, {
      wrapper
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it(`should merge overrides`, () => {
    const { asFragment } = render(
      <ModelDisplayGroup
        overrides={{
          FilterLayout: {
            FilterLabel: Bar,
            Filter: Bar
          }
        }}
        path="name"
      />,
      {
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
