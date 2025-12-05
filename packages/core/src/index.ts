import { OpenAPIV3_1 } from './rhino-openapi';

// To be overridden/declared in the consuming project
export interface Resources {}

/* Available resources in the Rhino API */
export type RhinoResourceName = keyof Resources;

export interface RhinoResourceProperties {
  model: RhinoResourceName;
  modelPlural: string;
  name: string;
  ownedBy: string;
  path: string;
  pluralName: string;
  pluralReadableName: string;
  readableName: string;
  searchable: boolean;
  singular: boolean;
  'x-rhino-model'?: Omit<RhinoResourceProperties, 'x-rhino-model'>;
}

export interface RhinoAttributeProperties {
  name: string;
  readableName: string;
  readable: boolean;
  creatable: boolean;
  updatable: boolean;
  'x-rhino-attribute'?: Omit<RhinoAttributeProperties, 'x-rhino-attribute'>;
}

/* A description of a resource in the Rhino API based on the OpenAPI response */
export type RhinoResource = Omit<OpenAPIV3_1.SchemaObject, 'properties'> &
  RhinoResourceProperties & {
    // A real hack to get the "type" typed for us
    properties: {
      [name: string]: OpenAPIV3_1.MixedSchemaObject &
        RhinoAttributeProperties & {
          type:
            | 'boolean'
            | 'object'
            | 'number'
            | 'string'
            | 'integer'
            | 'array';
        };
    };
  };

/* Either the name of a resource or the resource itself */
export type RhinoResourceSpecifier = RhinoResourceName | RhinoResource;

/* Convert a RhinoResourceSpecifier to a resource */
export type RhinoResourceSpecifierToResource<T> = T extends RhinoResourceName
  ? Resources[T]
  : T extends RhinoResource
    ? Resources[T['model']]
    : never;

export type RhinoRecordIdentifier = string | number;
export type RhinoRecord = { [name: string]: unknown };

export * from './RhinoContext';
export * from './resources';
