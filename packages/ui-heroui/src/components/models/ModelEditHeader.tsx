import { useModelEditContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { ModelBreadcrumb, ModelBreadcrumbProps } from './ModelBreadcrumb';
import { RhinoResource } from '@rhino-project/core';

export type ModelEditHeaderProps = ModelBreadcrumbProps;

export const ModelEditHeaderBase = (props: ModelBreadcrumbProps) => {
  const {
    show: { resource }
  } = useModelEditContext() as { show: { resource: RhinoResource } };

  // @ts-expect-error FIXME: Type better - record instead of resource?
  return <ModelBreadcrumb lastItem="Edit" resource={resource} {...props} />;
};

export const ModelEditHeader = (props: ModelBreadcrumbProps) =>
  useGlobalComponentForModel('ModelEditHeader', ModelEditHeaderBase, props);
