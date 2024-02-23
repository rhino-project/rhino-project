import { Pager } from '../pagination';
import { useModelIndexContext } from '../../hooks/controllers';
import { useGlobalComponentForModel } from '../../hooks/overrides';

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

const ModelPager = (props) =>
  useGlobalComponentForModel('ModelPager', ModelPagerBase, props);

export default ModelPager;
