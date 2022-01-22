import * as utils from 'rhino/utils/models';

jest.mock('rhino/models', () => {
  const api = require('../../shared/modelFixtures');
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('rhino/models');

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    default: {
      api: {
        ...api.default
      }
    }
  };
});

describe('utils > models.js', () => {
  const userModel = utils.getModel('user');
  const getPath = (path) => utils.getAttributeFromPath(userModel, path);

  describe('getAttributeFromPath', () => {
    test('finds simple attribute by path', () => {
      expect(getPath('name')).toMatchObject({
        name: 'name'
      });
    });

    test('finds direct ref by path', () => {
      expect(getPath('organization.org_name')).toMatchObject({
        name: 'org_name'
      });
    });

    test('finds anyOf ref by path', () => {
      expect(getPath('organization_nullable.org_name')).toMatchObject({
        name: 'org_name'
      });
    });

    test('finds array items direct ref by path', () => {
      expect(getPath('organization_array.org_name')).toMatchObject({
        name: 'org_name'
      });
    });

    test('finds array items anyOf by path', () => {
      expect(getPath('organization_nullable_array.org_name')).toMatchObject({
        name: 'org_name'
      });
    });

    test('handles display_name', () => {
      expect(getPath('organization.display_name')).toMatchObject({
        model: 'organization',
        name: 'organization',
        readableName: 'Organization',
        type: 'string'
      });
    });

    test('handles filter operation specifier', () => {
      expect(getPath('organization.org_name::tree_subtree')).toMatchObject({
        name: 'org_name'
      });
    });

    test('handles filter array access', () => {
      expect(getPath('organization_nullable_array[0].org_name')).toMatchObject({
        name: 'org_name'
      });
    });
  });

  describe('getModelAndAttributeFromPath', () => {
    test('finds simple attribute by path', () => {
      const [, , operator, plainPath] = utils.getModelAndAttributeFromPath(
        userModel,
        'organization.org_name::gteq'
      );
      expect(operator).toBe('gteq');
      expect(plainPath).toBe('organization.org_name');
    });
  });

  describe('authOwner', () => {
    test('finds authOwner model', () => {
      expect(utils.authOwnerModel()).toMatchObject({
        model: 'user'
      });
    });
  });

  describe('baseOwner', () => {
    test('finds baseOwner model', () => {
      expect(utils.baseOwnerModel()).toMatchObject({
        model: 'organization'
      });
    });
  });
});
