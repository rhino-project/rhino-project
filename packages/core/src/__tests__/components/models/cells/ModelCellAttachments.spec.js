import { render } from '@testing-library/react';
import ModelCellAttachments from 'rhino/components/models/cells/ModelCellAttachments';
import { sharedCellTests } from './sharedCellTests';

describe('ModelCellAttachments', () => {
  sharedCellTests(ModelCellAttachments);
});
