import { render } from '@testing-library/react';
import ModelDisplayGroup from 'rhino/components/models/ModelDisplayGroup';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModelShowSimple from 'rhino/components/models/ModelShowSimple';
import * as network from 'rhino/lib/networking';

network.networkApiCall = jest.fn(() => ({
  data: {
    test: 'test'
  }
}));

jest.mock('rhino/models', () => {
  const api = require('../../../shared/modelFixtures');
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('rhino/models');

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    default: {
      api: {
        ...api.default
      }
    }
  };
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
