import { Pager } from 'rhino/components/pagination';
import { useModelIndexContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';

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

const ModelPager = (props) => useGlobalComponent(ModelPagerBase, props);

export default ModelPager;
