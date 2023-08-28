import { render } from '@testing-library/react';
import ModelFieldGroup from 'rhino/components/models/ModelFieldGroup';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModelEditSimple from 'rhino/components/models/ModelEditSimple';

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

describe('ModelFieldGroup', () => {
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
        <ModelEditSimple model="user">{children}</ModelEditSimple>
      </QueryClientProvider>
    );
  };

  const Bar = (props) => <div>Bar</div>;

  sharedModelTests(ModelFieldGroup);

  it(`should render without prop`, () => {
    const { asFragment } = render(<ModelFieldGroup path="name" />, {
      wrapper
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it(`should merge overrides`, () => {
    const { asFragment } = render(
      <ModelFieldGroup
        path="name"
        overrides={{
          ModelFieldLayout: {
            ModelFieldLabel: Bar,
            ModelField: Bar
          }
        }}
      />,
      {
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
