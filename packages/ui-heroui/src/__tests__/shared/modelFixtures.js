export const api = {
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
            type: 'integer',
            format: 'identifier'
          },
          name: {
            name: 'name',
            readableName: 'Name',
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
        'x-rhino-model': {
          model: 'organization',
          modelPlural: 'organizations',
          name: 'organization',
          pluralName: 'organizations',
          readableName: 'Organization',
          pluralReadableName: 'Organizations',
          ownedBy: null,
          singular: false,
          path: '/api/organization'
        },
        model: 'organization',
        modelPlural: 'organizations',
        ownedBy: null,
        type: 'object',
        properties: {
          id: {
            name: 'id',
            readOnly: true,
            nullable: false,
            type: 'integer',
            format: 'identifier'
          },
          org_name: {
            name: 'org_name',
            type: 'string'
          }
        },
        required: ['org_name']
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
        ownedBy: 'organization',
        properties: {
          id: {
            name: 'id',
            readableName: 'Id',
            readable: true,
            creatable: false,
            updatable: false,
            readOnly: true,
            nullable: false,
            type: 'integer',
            format: 'identifier'
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
          words: {
            name: 'words',
            readableName: 'Words',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: false,
            type: 'integer'
          },
          words_min: {
            name: 'words_min',
            readableName: 'Words',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: false,
            type: 'integer',
            minimum: 5
          },
          words_min_exclusive: {
            name: 'words_min_exclusive',
            readableName: 'Words',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: false,
            type: 'integer',
            minimum: 5,
            exclusiveMinimum: true
          },
          words_max: {
            name: 'words_max',
            readableName: 'Words',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: false,
            type: 'integer',
            maximum: 5
          },
          words_max_exclusive: {
            name: 'words_max_exclusive',
            readableName: 'Words',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: false,
            type: 'integer',
            maximum: 5,
            exclusiveMaximum: true
          },
          score_min: {
            name: 'score_min',
            readableName: 'Score',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: false,
            type: 'number',
            minimum: 5
          },
          score_min_exclusive: {
            name: 'score_min_exclusive',
            readableName: 'Score',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: false,
            type: 'number',
            minimum: 5,
            exclusiveMinimum: true
          },
          score_max: {
            name: 'score_max',
            readableName: 'Score',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: false,
            type: 'number',
            maximum: 5
          },
          score_max_exclusive: {
            name: 'score_max_exclusive',
            readableName: 'Score',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: false,
            type: 'number',
            maximum: 5,
            exclusiveMaximum: true
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
          published_at_min: {
            name: 'published_at_min',
            readableName: 'Published At',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'string',
            format: 'datetime',
            minimum: '1982-02-07T05:00:00.000Z'
          },
          published_at_min_exclusive: {
            name: 'published_at_min_exclusive',
            readableName: 'Published At',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'string',
            format: 'datetime',
            minimum: '1982-02-07T05:00:00.000Z',
            exclusiveMinimum: true
          },
          published_at_max: {
            name: 'published_at_max',
            readableName: 'Published At',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'string',
            format: 'datetime',
            maximum: '2030-02-07T05:00:00.000Z'
          },
          published_at_max_exclusive: {
            name: 'published_at_max_exclusive',
            readableName: 'Published At',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'string',
            format: 'datetime',
            maximum: '2030-02-07T05:00:00.000Z',
            exclusiveMaximum: true
          },
          published_date_min: {
            name: 'published_date_min',
            readableName: 'Published Date',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'string',
            format: 'datetime',
            minimum: '1982-02-07'
          },
          published_date_min_exclusive: {
            name: 'published_date_min_exclusive',
            readableName: 'Published Date',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'string',
            format: 'date',
            minimum: '1982-02-07',
            exclusiveMinimum: true
          },
          published_date_max: {
            name: 'published_date_max',
            readableName: 'Published Date',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'string',
            format: 'date',
            maximum: '2030-02-07'
          },
          published_date_max_exclusive: {
            name: 'published_date_max_exclusive',
            readableName: 'Published Date',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'string',
            format: 'date',
            maximum: '2030-02-07',
            exclusiveMaximum: true
          },
          published_year_min: {
            name: 'published_year_min',
            readableName: 'Published At',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'integer',
            format: 'year',
            minimum: 1982
          },
          published_year_min_exclusive: {
            name: 'published_year_min_exclusive',
            readableName: 'Published At',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'integer',
            format: 'year',
            minimum: 1982,
            exclusiveMinimum: true
          },
          published_year_max: {
            name: 'published_year_max',
            readableName: 'Published At',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'integer',
            format: 'year',
            maximum: 2030
          },
          published_year_max_exclusive: {
            name: 'published_year_max_exclusive',
            readableName: 'Published At',
            readable: true,
            creatable: true,
            updatable: true,
            nullable: true,
            type: 'integer',
            format: 'year',
            maximum: 2030,
            exclusiveMaximum: true
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
