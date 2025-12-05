import { render } from '@testing-library/react';
import rhinoConfig from 'rhino.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModelShowSimple } from '../../../../components/models/ModelShowSimple';
import { DisplayDateTime } from '../../../../Display';
import { fromDate, getLocalTimeZone } from '@internationalized/date';

const getBarValue = () => 'bar';

describe('DisplayDateTime', () => {
  const Bar = () => <div>Bar</div>;
  const placeholderValue = fromDate(
    new Date(2025, 1, 7, 14, 56, 17),
    getLocalTimeZone()
  );

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
      .mockReturnValue({ ['DisplayDateTime']: Bar });

    const { asFragment } = render(
      <DisplayDateTime getValue={getBarValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders inside of model context', () => {
    const { asFragment } = render(
      <DisplayDateTime
        path="dummy"
        aria-label="dummy"
        placeholderValue={placeholderValue}
      />,
      {
        wrapper: FormWrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the empty text when value is nullish`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(
      <DisplayDateTime
        path="dummy"
        aria-label="dummy"
        placeholderValue={placeholderValue}
      />,
      {
        wrapper: FormWrapper
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
