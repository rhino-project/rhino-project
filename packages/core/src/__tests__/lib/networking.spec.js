import { constructPath } from 'rhino/lib/networking';

const EXPECTED_URL = 'http://example.com/api';

describe('networking', () => {
  describe('constructPath', () => {
    describe('root path with slash', () => {
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
