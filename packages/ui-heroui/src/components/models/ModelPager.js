import { Pagination } from '@heroui/react';
import { useModelIndexContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';

export const ModelPagerBase = (props) => {
  const { totalPages, setPage, page } = useModelIndexContext();

  return (
    <Pagination
      page={page}
      total={totalPages || null}
      showControls
      onChange={setPage}
    />
  );
};

export const ModelPager = (props) =>
  useGlobalComponentForModel('ModelPager', ModelPagerBase, props);
