import { OpenAPIV3_1 } from './rhino-openapi';

// To be overridden/declared in the consuming project
export interface Resources {}
export interface RhinoProperties {
  model: string;
  modelPlural: string;
  name: string;
  ownedBy: string;
  path: string;
  pluralName: string;
  pluralReadableName: string;
  readableName: string;
  searchable: boolean;
  singular: boolean;
  'x-rhino-model'?: Omit<RhinoProperties, 'x-rhino-model'>;
}

export type RhinoResource = OpenAPIV3_1.SchemaObject & RhinoProperties;
export type RhinoResourceName = keyof Resources;
export type RhinoResourceSpecifier = RhinoResourceName | RhinoResource;

export * from './RhinoContext';
export * from './resources';
