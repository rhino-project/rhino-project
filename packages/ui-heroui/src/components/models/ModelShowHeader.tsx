import { useModelShowContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { ModelBreadcrumb, ModelBreadcrumbProps } from './ModelBreadcrumb';

export type ModelShowHeaderProps = ModelBreadcrumbProps;

export const ModelShowHeaderBase = (props: ModelShowHeaderProps) => {
  const { resource } = useModelShowContext() as {
    resource: Record<string, unknown>;
  };

  // @ts-expect-error FIXME: Type better - record instead of resource?
  return <ModelBreadcrumb resource={resource} {...props} />;
};

export const ModelShowHeader = (props: ModelShowHeaderProps) =>
  useGlobalComponentForModel('ModelShowHeader', ModelShowHeaderBase, props);
