import { render } from '@testing-library/react';
import {
  ModelIndexSimple,
  ModelIndexTable
} from '../../../../components/models';
import { ModelCellIdentifier } from '../../../../components/models/cells/ModellCellIdentifier';
import { createWrapper } from '../../../shared/helpers';
import { sharedCellTests } from './sharedCellTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('ModelCellIdentifier', () => {
  const Wrapper = ({ children, ...props }) => {
    const queryClient = new QueryClient();

    return (
      <MemoryRouter {...props}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/:baseOwnerId/*" element={<>{children}</>} />
          </Routes>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  sharedCellTests(ModelCellIdentifier);

  it('renders absolute link', () => {
    const { asFragment } = render(
      <ModelIndexSimple
        model="blog"
        queryOptions={{ initialData: { results: [{ id: 1 }] } }}
      >
        <ModelIndexTable paths={['id']} />
      </ModelIndexSimple>,
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
