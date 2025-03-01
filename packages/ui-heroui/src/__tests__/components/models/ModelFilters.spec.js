import { ModelFilters } from '../../../components/models/ModelFilters';
import { sharedModelTests } from './sharedModelTests';
import { fireEvent, render, screen } from '@testing-library/react';

import { createWrapper } from '../../shared/helpers';

describe('ModelFilters', () => {
  sharedModelTests(ModelFilters);

  it.skip('resets reference filter defaults', async () => {
    const { asFragment } = render(<ModelFilters paths={['author']} />, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1/blogs?filter[author][id]=2']
      })
    });
    expect(asFragment()).toMatchSnapshot();

    const authorFilter = screen.getByDisplayValue('other@example.com');
    expect(authorFilter.value).toBe('2');

    fireEvent.click(screen.getByText('Clear all filters'));

    expect(authorFilter.value).toBe('');
  });
});
