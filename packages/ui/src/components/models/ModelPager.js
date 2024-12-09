import { Pager } from '../pagination';
import { useModelIndexContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';

export const ModelPagerBase = (props) => {
  const {
    hasPrevPage,
    hasNextPage,
    firstPage,
    lastPage,
    totalPages,
    setPage,
    page
  } = useModelIndexContext();

  return (
    <Pager
      hasNext={hasNextPage}
      hasPrev={hasPrevPage}
      firstPage={firstPage}
      lastPage={lastPage}
      totalPages={totalPages}
      setPage={setPage}
      page={page}
      {...props}
    />
  );
};

export const ModelPager = (props) =>
  useGlobalComponentForModel('ModelPager', ModelPagerBase, props);
