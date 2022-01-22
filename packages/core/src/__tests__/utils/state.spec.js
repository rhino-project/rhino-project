import { isSessionValid } from 'rhino/utils/state';

describe('utils > state.js', () => {

  describe('isSessionValid', () => {
    test('returns false for undefined session', () => {
      expect(isSessionValid(undefined)).toBe(false)
    })

    test('returns false for session object with less than three keys', () => {
      expect(isSessionValid({key1: '',key2: ''})).toBe(false)
    })

    test('returns false for session object with more than three keys', () => {
      expect(isSessionValid({key1: '',key2: '',key3: '', key4: ''})).toBe(false)
    })

    test('returns true for session object with exactly three keys', () => {
      expect(isSessionValid({key1: '',key2: '',key3: ''})).toBe(true)
    })
  });
});
