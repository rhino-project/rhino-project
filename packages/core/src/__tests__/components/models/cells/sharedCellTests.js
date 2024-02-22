import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import rhinoConfig from 'rhino.config';
import ModelIndexSimple from 'rhino/components/models/ModelIndexSimple';

const getBarValue = () => 'bar';

export const sharedCellTests = (Component) => {
  const overrideName = Component.displayName || Component.name;
  const nullGetValue = () => null;
  const Bar = () => <div>Bar</div>;

  const Wrapper = ({ children }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ModelIndexSimple
            model="blog"
            fallback={false}
            queryOptions={{ disabled: true }}
          >
            {children}
          </ModelIndexSimple>
        </MemoryRouter>
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

  it(`should render with global override shorthand for model`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ user: { [overrideName]: Bar } });

    const { asFragment } = render(
      <Component getValue={getBarValue} model="user" path="name" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model and attribute`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ user: { name: { [overrideName]: Bar } } });

    const { asFragment } = render(
      <Component getValue={getBarValue} model="user" path="name" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the empty text when value is nullish`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(
      <Component getValue={nullGetValue} path="dummy" />,
      { wrapper: Wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the overridden empty text when value is nullish`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(
      <Component empty="baz" getValue={nullGetValue} path="dummy" />,
      { wrapper: Wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the component with className from inherited props`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(
      <Component
        empty="baz"
        getValue={nullGetValue}
        path="dummy"
        className="dummy-class"
      />,
      { wrapper: Wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });
};
