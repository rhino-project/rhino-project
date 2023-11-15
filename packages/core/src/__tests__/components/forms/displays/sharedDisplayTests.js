import { render } from '@testing-library/react';
import rhinoConfig from 'rhino.config';
import modelLoader from 'rhino/models';
import api from '__tests__/shared/modelFixtures';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModelShowSimple from 'rhino/components/models/ModelShowSimple';

const getBarValue = () => 'bar';

vi.spyOn(modelLoader, 'api', 'get').mockReturnValue(api);

export const sharedDisplayTests = (Component) => {
  const overrideName = Component.displayName || Component.name;
  const Bar = () => <div>Bar</div>;

  const FormWrapper = ({ children }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    return (
      <QueryClientProvider client={queryClient}>
        <ModelShowSimple fallback={false} model="user">
          {children}
        </ModelShowSimple>
      </QueryClientProvider>
    );
  };

  let configSpy;

  afterEach(() => {
    configSpy.mockRestore();
  });

  it(`should render with global override shorthand`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ [overrideName]: Bar });

    const { asFragment } = render(
      <Component getValue={getBarValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders inside of model context', () => {
    const { asFragment } = render(<Component path="dummy" />, {
      wrapper: FormWrapper
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the empty text when value is nullish`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(<Component path="dummy" />, {
      wrapper: FormWrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the overridden empty text when value is nullish`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(<Component empty="baz" path="dummy" />, {
      wrapper: FormWrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });
};
