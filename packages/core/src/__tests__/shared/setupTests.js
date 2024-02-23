import modelLoader from '../../models';

// Force modelLoader to load models synchronously and then mock the api
modelLoader.loadModels(true);

vi.mock('@rollbar/react', async () => {
  const actual = await vi.importActual('@rollbar/react');
  return {
    ...actual,
    useRollbarPerson: () => null
  };
});
