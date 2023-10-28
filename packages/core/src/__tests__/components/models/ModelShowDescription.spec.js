import ModelShowDescription from 'rhino/components/models/ModelShowDescription';
import ModelShowSimple from 'rhino/components/models/ModelShowSimple';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import api from '__tests__/shared/modelFixtures';
import modelLoader from 'rhino/models';

vi.spyOn(modelLoader, 'api', 'get').mockReturnValue(api);

describe('ModelShowDescription', () => {
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

  sharedModelTests(ModelShowDescription);

  it(`should allow paths to be directly overridden`, async () => {
    const { asFragment } = render(
      <ModelShowSimple model="blog" fallback={false}>
        <ModelShowDescription paths={['title']} />
      </ModelShowSimple>,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
