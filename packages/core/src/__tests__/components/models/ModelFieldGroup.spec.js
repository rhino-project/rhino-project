import { render } from '@testing-library/react';
import ModelFieldGroup from 'rhino/components/models/ModelFieldGroup';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModelEditSimple from 'rhino/components/models/ModelEditSimple';
import modelLoader from 'rhino/models';
import api from '../../../shared/modelFixtures';
import rhinoConfig from 'rhino.config';

vi.spyOn(modelLoader, 'api', 'get').mockReturnValue(api);
vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({
  version: 1,
  components: {}
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
        <ModelEditSimple model="blog">{children}</ModelEditSimple>
      </QueryClientProvider>
    );
  };

  const Bar = () => <div>Bar</div>;

  sharedModelTests(ModelFieldGroup);

  it(`should render without prop`, () => {
    const { asFragment } = render(<ModelFieldGroup path="title" />, {
      wrapper
    });

    expect(asFragment()).toMatchSnapshot();
  });

  // FIXME: Should test all the overrideable fields
  it(`should use overrides`, () => {
    const { asFragment } = render(
      <ModelFieldGroup
        path="title"
        overrides={{
          ModelFieldGroupString: Bar
        }}
      />,
      {
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
