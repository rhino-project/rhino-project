import { getIcon, loadIcons } from '@iconify/react/dist/iconify.js';
import { CellBooleanIcon } from '../../../../components/table/cells/CellBooleanIcon';
import { sharedCellTests } from './sharedCellTests';
import { waitFor } from '@testing-library/react';

describe('CellBooleanIcon', () => {
  beforeAll(async () => {
    await loadIcons(['bi:dash']);
    await waitFor(() => expect(getIcon('bi:dash')).toBeTruthy());
  });

  sharedCellTests(CellBooleanIcon);
});
