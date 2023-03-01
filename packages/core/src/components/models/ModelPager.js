import { Pager } from 'rhino/components/pagination';
import { useModelIndexContext } from 'rhino/hooks/controllers';

const ModelPager = (props) => {
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

export default ModelPager;
