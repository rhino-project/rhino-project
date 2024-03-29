import { render } from '@testing-library/react';
import rhinoConfig from 'rhino.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { MemoryRouter } from 'react-router-dom';
import { ModelIndexTable } from '../../../../components/models/ModelIndexTable';
import { Children } from 'react';

const getBarValue = () => 'bar';

export const sharedCellTests = (Component) => {
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
        <MemoryRouter>
          <ModelIndexSimple
            fallback={false}
            model="user"
            queryOptions={{ enabled: false }}
          >
            <ModelIndexTable paths={Children.toArray(children)} />
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

    const { asFragment } = render(<Component getValue={getBarValue} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders inside of model context', () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});
    const { asFragment } = render(<Component />, {
      wrapper: FormWrapper
    });

    expect(asFragment()).toMatchSnapshot();
  });
};
