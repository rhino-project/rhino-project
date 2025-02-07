import rhinoConfig from 'rhino.config';
import { render } from '@testing-library/react';
import { DisplayDate } from '../../../../Display';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModelShowSimple } from '../../../../components/models/ModelShowSimple';
import { CalendarDate } from '@internationalized/date';

const getBarValue = () => 'bar';

describe('DisplayDate', () => {
  const Bar = () => <div>Bar</div>;
  const placeholderValue = new CalendarDate(2025, 2, 7);

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
        <ModelShowSimple
          fallback={false}
          model="user"
          queryOptions={{ enabled: false }}
        >
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
      .mockReturnValue({ ['DisplayDate']: Bar });

    const { asFragment } = render(
      <DisplayDate getValue={getBarValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders inside of model context', () => {
    const { asFragment } = render(
      <DisplayDate path="dummy" placeholderValue={placeholderValue} />,
      {
        wrapper: FormWrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the empty text when value is nullish`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(
      <DisplayDate path="dummy" placeholderValue={placeholderValue} />,
      {
        wrapper: FormWrapper
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
