import { getIcon, loadIcons } from '@iconify/react/dist/iconify.js';
import { FieldBooleanIcon } from '../../../../Field';
import { sharedFieldTests } from './sharedFieldTests';
import { waitFor } from '@testing-library/react';

describe('FieldBooleanIcon', () => {
  beforeAll(async () => {
    await loadIcons(['bi:x']);
    await waitFor(() => expect(getIcon('bi:x')).toBeTruthy());
  });

  sharedFieldTests(FieldBooleanIcon);
});
