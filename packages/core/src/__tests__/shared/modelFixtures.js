const api = {
  openapi: '3.0.3',
  components: {
    schemas: {
      user: {
        model: 'user',
        modelPlural: 'users',
        type: 'object',
        properties: {
          id: {
            name: 'id',
            readOnly: true,
            nullable: false,
            type: 'identifier'
          },
          name: {
            name: 'name',
            nullable: true,
            type: 'string'
          },
          organization: {
            name: 'organization',
            readableName: 'Organization',
            readOnly: true,
            $ref: '#/components/schemas/organization'
          },
          organization_nullable: {
            name: 'organization_nullable',
            readOnly: true,
            nullable: true,
            anyOf: [
              {
                $ref: '#/components/schemas/organization'
              }
            ]
          },
          organization_array: {
            name: 'organization_array',
            readOnly: true,
            type: 'array',
            items: {
              $ref: '#/components/schemas/organization'
            }
          },
          organization_nullable_array: {
            name: 'organization_nullable_array',
            readOnly: true,
            nullable: true,
            type: 'array',
            items: {
              type: 'reference',
              anyOf: [
                {
                  $ref: '#/components/schemas/organization'
                }
              ]
            }
          }
        },
        required: ['name']
      },
      organization: {
        model: 'organization',
        modelPlural: 'organizations',
        type: 'object',
        properties: {
          id: {
            name: 'id',
            readOnly: true,
            nullable: false,
            type: 'identifier'
          },
          org_name: {
            name: 'org_name',
            type: 'string'
          }
        },
        required: ['name']
      }
    }
  },
  paths: {},
  info: {
    'x-rhino': {
      modules: {
        rhino: {
          authOwner: 'user',
          baseOwner: 'organization'
        }
      }
    }
  }
};

export default api;
