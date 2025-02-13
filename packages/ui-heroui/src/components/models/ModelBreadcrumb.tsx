import { ReactNode, useMemo } from 'react';
import {
  useBaseOwnerPath,
  useGlobalComponentForModel,
  useModelContext
} from '@rhino-project/core/hooks';
import { BreadcrumbItem, Breadcrumbs, BreadcrumbsProps } from '@heroui/react';

export type ModelBreadcrumbProps = {
  lastItem?: ReactNode;
  resource?: Record<string, unknown>;
} & BreadcrumbsProps;

export const ModelBreadcrumbBase = ({
  lastItem,
  resource,
  ...props
}: ModelBreadcrumbProps) => {
  const { model } = useModelContext() as {
    model: { name: string; model: string; pluralReadableName: string };
  };
  const { build } = useBaseOwnerPath();

  const breadcrumbs = useMemo(() => {
    const result = [];

    if (resource) {
      result.unshift({
        key: `${model.name}-${String(resource.id)}`,
        children: resource?.display_name as ReactNode,
        href: build(`${model.model}/${resource.id}`)
      });
    }

    result.unshift({
      key: model.name,
      children: model.pluralReadableName,
      href: build(`${model.model}`)
    });

    if (lastItem) {
      result.push({
        key: 'lastItem',
        children: lastItem
      });
    }

    return result;
  }, [build, lastItem, model, resource]);

  return (
    <Breadcrumbs {...props}>
      {breadcrumbs.map((breadcrumb) => (
        <BreadcrumbItem {...breadcrumb} />
      ))}
    </Breadcrumbs>
  );
};

export const ModelBreadcrumb = (props: ModelBreadcrumbProps) =>
  useGlobalComponentForModel('ModelBreadcrumb', ModelBreadcrumbBase, props);
