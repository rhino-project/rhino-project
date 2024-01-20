import env from '@rhino-project/config/env';
import { constructPath } from 'rhino/lib/networking';

const EXPECTED_URL = new URL('api', env.API_ROOT_PATH).toString();

describe('networking', () => {
  describe('constructPath', () => {
    describe('root path with slash', () => {
      it('handles no slash on the api path', () => {
        expect(constructPath('api')).toEqual(EXPECTED_URL);
      });

      it('handles slash on the api path', () => {
        expect(constructPath('/api')).toEqual(EXPECTED_URL);
      });
    });

    describe('root path without slash', () => {
      beforeEach(() => {
        vi.mock('rhino/config/index', () => ({
          API_ROOT_PATH: 'http://example.com/'
        }));
      });

      afterEach(() => {
        vi.clearAllMocks();
      });

      it('handles no slash on the api path', () => {
        expect(constructPath('api')).toEqual(EXPECTED_URL);
      });

      it('handles slash on the api path', () => {
        expect(constructPath('/api')).toEqual(EXPECTED_URL);
      });
    });
  });
});
