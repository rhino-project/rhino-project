import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import api from '__tests__/shared/modelFixtures';
import FieldInput from 'rhino/components/forms/fields/FieldInput';
import ModelEditSimple from 'rhino/components/models/ModelEditSimple';
import modelLoader from 'rhino/models';

vi.spyOn(modelLoader, 'api', 'get').mockReturnValue(api);

describe('FieldInput', () => {
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

  it('renders inside of model context', () => {
    const { asFragment } = render(<FieldInput path="dummy" />, {
      wrapper: FormWrapper
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
