import { ModelShow } from '../../../components/models/ModelShow';
import { sharedModelTests } from './sharedModelTests';
import * as network from '@rhino-project/core/lib';

vi.spyOn(network, 'networkApiCall').mockReturnValue({
  data: {
    test: 'test'
  }
});

describe('ModelShow', () => {
  sharedModelTests(ModelShow);
});
