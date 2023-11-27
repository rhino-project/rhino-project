const api = {
  openapi: '3.0.3',
  components: {
    schemas: {
      user: {
        model: 'user',
        modelPlural: 'users',
        name: 'user',
        pluralName: 'users',
        readableName: 'User',
        pluralReadableName: 'Users',
        ownedBy: null,
        path: '/api/users',
        searchable: false,
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
      },
      blog: {
        'x-rhino-model': {
          model: 'blog',
          modelPlural: 'blogs',
          name: 'blog',
          pluralName: 'blogs',
          readableName: 'Blog',
          pluralReadableName: 'Blogs',
          ownedBy: 'organization',
          singular: false,
          path: '/api/blogs',
          searchable: true
        },
        type: 'object',
        properties: {
          id: {
            name: 'id',
            readableName: 'Id',
            readable: true,
            creatable: false,
            updatable: false,
            readOnly: true,
            nullable: false,
            type: 'identifier'
          },
          title: {
            name: 'title',
            readableName: 'Title',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: false,
            type: 'string'
          },
          published_at: {
            name: 'published_at',
            readableName: 'Published At',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'string',
            format: 'datetime'
          },
          created_at: {
            name: 'created_at',
            readableName: 'Created At',
            readable: true,
            creatable: false,
            updatable: false,
            readOnly: true,
            nullable: false,
            type: 'string',
            format: 'datetime'
          },
          updated_at: {
            name: 'updated_at',
            readableName: 'Updated At',
            readable: true,
            creatable: false,
            updatable: false,
            readOnly: true,
            nullable: false,
            type: 'string',
            format: 'datetime'
          },
          author: {
            name: 'author',
            readableName: 'Author',
            readable: true,
            creatable: false,
            updatable: false,
            readOnly: true,
            nullable: false,
            type: 'reference',
            anyOf: [
              {
                $ref: '#/components/schemas/user'
              }
            ]
          },
          organization: {
            name: 'organization',
            readableName: 'Organization',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: false,
            type: 'reference',
            anyOf: [
              {
                $ref: '#/components/schemas/organization'
              }
            ]
          },
          blog_posts: {
            name: 'blog_posts',
            readableName: 'Blog Posts',
            readable: true,
            creatable: false,
            updatable: false,
            readOnly: true,
            nullable: true,
            type: 'array',
            items: {
              type: 'reference',
              anyOf: [
                {
                  $ref: '#/components/schemas/blog_post'
                }
              ],
              'x-rhino-attribute-array': {}
            }
          }
        },
        required: ['title', 'organization']
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
