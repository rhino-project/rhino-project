import { OpenAPIV3_1 } from './rhino-openapi';

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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Resources {}

export * from './RhinoContext';
export * from './resources';
