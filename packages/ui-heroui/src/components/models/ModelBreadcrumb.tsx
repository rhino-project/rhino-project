import { ReactNode, useMemo } from 'react';
import {
  useBaseOwnerPath,
  useGlobalComponentForModel,
  useModelContext
} from '@rhino-project/core/hooks';
import { BreadcrumbItem, Breadcrumbs, BreadcrumbsProps } from '@heroui/react';
import { getModelIndexPath, getModelShowPath } from '@rhino-project/core/utils';

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
    model: { pluralReadableName: string };
  };
  const { build } = useBaseOwnerPath();

  const breadcrumbs = useMemo(() => {
    const result = [];

    if (resource) {
      result.unshift({
        children: resource?.display_name as ReactNode,
        href: build(getModelShowPath(model, resource.id))
      });
    }

    result.unshift({
      children: model.pluralReadableName,
      href: build(getModelIndexPath(model))
    });

    if (lastItem) {
      result.push({
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
