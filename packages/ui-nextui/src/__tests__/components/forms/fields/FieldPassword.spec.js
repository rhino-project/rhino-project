import { getIcon, loadIcons } from '@iconify/react/dist/iconify.js';
import { FieldPassword } from '../../../../Field';
import { sharedFieldTests } from './sharedFieldTests';
import { waitFor } from '@testing-library/react';

describe('FieldPassword', () => {
  beforeAll(async () => {
    await loadIcons(['bi:eye-fill']);
    await waitFor(() => expect(getIcon('bi:eye-fill')).toBeTruthy());
  });

  sharedFieldTests(FieldPassword);
});
