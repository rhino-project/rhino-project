import React from 'react';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { ModelBreadcrumb, ModelBreadcrumbProps } from './ModelBreadcrumb';

export type ModelCreateHeaderProps = ModelBreadcrumbProps;

export const ModelCreateHeaderBase = (props: ModelCreateHeaderProps) => {
  return <ModelBreadcrumb lastItem="Create" {...props} />;
};

export const ModelCreateHeader = (props: ModelCreateHeaderProps) =>
  useGlobalComponentForModel('ModelCreateHeader', ModelCreateHeaderBase, props);
