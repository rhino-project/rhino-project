import { sharedDisplayTests } from './sharedDisplayTests';
import ModelDisplayReferenceLink from 'rhino/components/models/displays/ModelDisplayReferenceLink';

vi.mock('rhino/hooks/history', () => {
  return {
    useBaseOwnerPath: vi.fn(() => {
      return {
        build: vi.fn(() => '/dummy/edit/1')
      };
    })
  };
});

vi.mock('rhino/utils/routes', () => {
  return {
    getModelShowPath: vi.fn(() => '/dummy/edit/1')
  };
});

vi.mock('rhino/utils/models', () => {
  return {
    getAttributeFromPath: vi.fn(() => ({})),
    getModelFromRef: vi.fn(() => ({
      name: 'Dummy'
    }))
  };
});

describe('ModelDisplayReferenceLink', () => {
  sharedDisplayTests(ModelDisplayReferenceLink);
});
