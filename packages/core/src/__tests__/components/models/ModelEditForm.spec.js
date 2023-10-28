import ModelEditForm from 'rhino/components/models/ModelEditForm';
import ModelEditSimple from 'rhino/components/models/ModelEditSimple';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import api from '__tests__/shared/modelFixtures';
import modelLoader from 'rhino/models';

vi.spyOn(modelLoader, 'api', 'get').mockReturnValue(api);

describe('ModelEditForm', () => {
  const wrapper = ({ children }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  sharedModelTests(ModelEditForm);

  it(`should allow paths to be directly overridden`, async () => {
    const { asFragment } = render(
      <ModelEditSimple model="blog" fallback={false}>
        <ModelEditForm paths={['title']} />
      </ModelEditSimple>,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
