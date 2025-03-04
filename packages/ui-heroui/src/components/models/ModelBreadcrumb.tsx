import { ReactNode, useMemo } from 'react';
import {
  useGlobalComponentForModel,
  useModelContext
} from '@rhino-project/core/hooks';
import { BreadcrumbItem, Breadcrumbs, BreadcrumbsProps } from '@heroui/react';
import { RhinoResource } from '@rhino-project/core';
import { useBaseOwnerPath } from '../../hooks';

export type ModelBreadcrumbProps = {
  lastItem?: ReactNode;
  resource?: RhinoResource;
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
        // @ts-expect-error FIXME: Type better
        key: `${model.name}-${String(resource.id)}`,
        // @ts-expect-error FIXME: Type better
        children: resource?.display_name as ReactNode,
        // @ts-expect-error FIXME: Type better
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
        // eslint-disable-next-line react/jsx-key
        <BreadcrumbItem {...breadcrumb} />
      ))}
    </Breadcrumbs>
  );
};

export const ModelBreadcrumb = (props: ModelBreadcrumbProps) =>
  useGlobalComponentForModel('ModelBreadcrumb', ModelBreadcrumbBase, props);
