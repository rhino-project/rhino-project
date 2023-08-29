import React from 'react';
import renderer from 'react-test-renderer';
import * as utils from 'rhino/utils/models';
import * as queries from 'rhino/hooks/queries';
import { ModelFormGroupVertical } from 'rhino/components/models/ModelFormGroup';
import modelLoader from 'rhino/models';
import * as uuid from 'uuid';
import api from '../../../shared/modelFixtures';

vi.spyOn(modelLoader, 'api', 'get').mockReturnValue(api);

// Mock the uuid function used to generate a predictable id
vi.spyOn(uuid, 'v4').mockReturnValue('123');

const ATTRIBUTES = [
  {},
  {
    readableName: 'Array > String Attribute',
    type: 'array',
    items: { type: 'string' }
  },
  {
    readableName: 'Array > Reference Attribute',
    type: 'array',
    items: {
      type: 'reference',
      anyOf: [
        {
          "$ref": "#/components/schemas/organization"
        }
      ],
      "x-rhino-attribute-array": {
        creatable: true,
        updatable: true,
        destroyable: true
      }
    }
  },
  {
    readableName: 'Array > Reference Attribute > Not creatable',
    type: 'array',
    items: {
      type: 'reference',
      anyOf: [
        {
          "$ref": "#/components/schemas/organization"
        }
      ],
      "x-rhino-attribute-array": {
        creatable: false,
        updatable: true,
        destroyable: true
      }
    }
  },
  {
    readableName: 'Array > Reference Attribute > Not updatable',
    type: 'array',
    items: {
      type: 'reference',
      anyOf: [
        {
          "$ref": "#/components/schemas/organization"
        }
      ],
      "x-rhino-attribute-array": {
        creatable: true,
        updatable: false,
        destroyable: true
      }
    }
  },
  {
    readableName: 'Array > Reference Attribute > Not destroyable',
    type: 'array',
    items: {
      type: 'reference',
      anyOf: [
        {
          "$ref": "#/components/schemas/organization"
        }
      ],
      "x-rhino-attribute-array": {
        creatable: true,
        updatable: true,
        destroyable: false
      }
    }
  },
  {
    name: 'test_attachment',
    readableName: 'Reference > Attachment Attribute',
    type: 'reference'
  },
  {
    readableName: 'Reference Attribute',
    type: 'reference'
  },
  { readableName: 'String Attribute', type: 'string' },
  { readableName: 'Boolean Attribute', type: 'boolean' },
  { readableName: 'Integer Attribute', type: 'integer' },
  { readableName: 'Integer Attribute Select', type: 'integer', format: 'select' },
  { readableName: 'Decimal Attribute', type: 'decimal' },
  { readableName: 'Float Attribute', type: 'float' },
  { readableName: 'Number Attribute', type: 'number' },
  { readableName: 'Decimal Attribute Currency', type: 'decimal', format: 'currency' },
  { readableName: 'Float Attribute Currency', type: 'float', format: 'currency' },
  { readableName: 'Number Attribute Currency', type: 'number', format: 'currency' },
  { readableName: 'Text Attribute', type: 'text' },
  { readableName: 'DateTime Attribute', type: 'string', format: 'datetime' },
  { readableName: 'Time Attribute', type: 'string', format: 'time' },
  { readableName: 'Date Attribute', type: 'string', format: 'date' },
  { readableName: 'Phone Attribute', type: 'string', format: 'phone' },
  { readableName: 'String > Enum Attribute', type: 'string', enum: ['y', 'n'] },
  { readableName: 'String Attribute', type: 'string' }
];

describe('ModelFormField', () => {
  vi
    .spyOn(utils, 'getIdentifierAttribute')
    .mockImplementation(() => () => ({ name: 'id' }));
  vi
    .spyOn(queries, 'useModelIndex')
    .mockImplementation(() => ({ data: {}, results: [] }));
  ATTRIBUTES.forEach((attribute) => {
    const readableName = attribute.readableName;
    const renderFunc = (attribute, extraProps = {}) =>
      renderer.create(
        <ModelFormGroupVertical
          attribute={attribute}
          path={'test'}
          resource={attribute.type === 'array' ? { test: [] } : { test: '' }}
          {...extraProps}
        />
      );

    test(`renders input for ${readableName}`, () => {
      const component = renderFunc(attribute);
      expect(component.toJSON()).toMatchSnapshot();
    });

    test(`renders required for ${readableName}`, () => {
      const component = renderFunc({ ...attribute, 'x-rhino-required': true });
      expect(component.toJSON()).toMatchSnapshot();
    });

    test(`renders errors for ${readableName}`, () => {
      const component = renderFunc(attribute, {
        errors: { test: ['display-error'] }
      });
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
