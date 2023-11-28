import { render } from '@testing-library/react';
import rhinoConfig from 'rhino.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModelEditSimple from 'rhino/components/models/ModelEditSimple';

const getBarValue = () => 'bar';

export const sharedFieldTests = (Component) => {
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
        <ModelEditSimple fallback={false} model="user">
          {children}
        </ModelEditSimple>
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

  it('render with place holder', () => {
    const { asFragment } = render(
      <Component path="dummy" placeholder="placeholder" />,
      {
        wrapper: FormWrapper
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });
};
