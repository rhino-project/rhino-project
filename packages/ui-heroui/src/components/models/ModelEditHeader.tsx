import React from 'react';
import { useModelEditContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { ModelBreadcrumb, ModelBreadcrumbProps } from './ModelBreadcrumb';

export type ModelEditHeaderProps = ModelBreadcrumbProps;

export const ModelEditHeaderBase = (props: ModelBreadcrumbProps) => {
  const {
    show: { resource }
  } = useModelEditContext() as { show: { resource: Record<string, unknown> } };

  return <ModelBreadcrumb lastItem="Edit" resource={resource} {...props} />;
};

export const ModelEditHeader = (props: ModelBreadcrumbProps) =>
  useGlobalComponentForModel('ModelEditHeader', ModelEditHeaderBase, props);
