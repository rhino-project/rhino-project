import routePaths from '../../routes';

describe('routePaths', () => {
  test.each([
    ['/', 'rootpath'],
    ['signin', 'sessionCreate'],
    ['signup', 'userCreate'],
    ['settings', 'settings'],
    ['forgot-password', 'forgotPassword'],
    ['/reset-password', 'resetPassword'],
    ['/reset-password/expired', 'tokenExpired']
  ])('returns %s for %s', (expectedPath, pathFunction) => {
    expect(routePaths[pathFunction]()).toBe(expectedPath);
  });
});
