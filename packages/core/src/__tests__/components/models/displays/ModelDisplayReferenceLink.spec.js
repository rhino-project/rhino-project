import { sharedDisplayTests } from './sharedDisplayTests';
import ModelDisplayReferenceLink from 'rhino/components/models/displays/ModelDisplayReferenceLink';

jest.mock('rhino/hooks/history', () => {
  return {
    useBaseOwnerPath: jest.fn(() => {
      return {
        build: jest.fn(() => '/dummy/edit/1')
      };
    })
  };
});

jest.mock('rhino/utils/routes', () => {
  return {
    getModelShowPath: jest.fn(() => '/dummy/edit/1')
  };
});

jest.mock('rhino/utils/models', () => {
  return {
    getAttributeFromPath: jest.fn(() => ({})),
    getModelFromRef: jest.fn(() => ({
      name: 'Dummy'
    }))
  };
});
describe('ModelDisplayReferenceLink', () => {
  sharedDisplayTests(ModelDisplayReferenceLink);
});
