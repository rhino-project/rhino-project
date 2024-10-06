import modelLoader from '@rhino-project/core/models';
import api from './modelFixtures';

// Force modelLoader to load models synchronously and then mock the api
modelLoader.loadModels(true);
vi.spyOn(modelLoader, 'api', 'get').mockReturnValue(api);

vi.mock('@rollbar/react', async () => {
  const actual = await vi.importActual('@rollbar/react');
  return {
    ...actual,
    useRollbarPerson: () => null
  };
});
