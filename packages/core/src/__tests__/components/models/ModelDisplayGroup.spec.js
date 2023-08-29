import { render } from '@testing-library/react';
import ModelDisplayGroup from 'rhino/components/models/ModelDisplayGroup';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModelShowSimple from 'rhino/components/models/ModelShowSimple';
import * as network from 'rhino/lib/networking';
import modelLoader from 'rhino/models';
import api from '../../../shared/modelFixtures';

vi.spyOn(modelLoader, 'api', 'get').mockReturnValue(api);

vi.spyOn(network, 'networkApiCall').mockReturnValue({
  data: {
    test: 'test'
  }
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
