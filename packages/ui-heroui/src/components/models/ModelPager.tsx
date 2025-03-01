import { Pagination, PaginationProps } from '@heroui/react';
import { useModelIndexContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';

export type ModelPagerProps = Partial<PaginationProps>;

export const ModelPagerBase = (props: ModelPagerProps) => {
  const { totalPages, setPage, page } = useModelIndexContext();

  return (
    <Pagination
      page={page}
      total={totalPages || null}
      showControls
      onChange={setPage}
      {...props}
    />
  );
};

export const ModelPager = (props: ModelPagerProps) =>
  useGlobalComponentForModel('ModelPager', ModelPagerBase, props);
