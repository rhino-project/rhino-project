import { render } from '@testing-library/react';
import ModelFieldGroup from 'rhino/components/models/ModelFieldGroup';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModelEditSimple from 'rhino/components/models/ModelEditSimple';
import modelLoader from 'rhino/models';
import api from '../../../shared/modelFixtures';

vi.spyOn(modelLoader, 'api', 'get').mockReturnValue(api);

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

  const Bar = () => <div>Bar</div>;

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
