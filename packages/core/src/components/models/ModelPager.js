import PropTypes from 'prop-types';
import React from 'react';
import { Pager } from 'rhino/components/pagination';
import { usePaginationParams } from 'rhino/hooks/history';

const ModelPager = ({ resources, searchParams, setSearchParams }) => {
  const [
    hasPrev,
    hasNext,
    firstPage,
    lastPage,
    totalPages,
    onSetPage,
    page
  ] = usePaginationParams(resources?.total, searchParams, setSearchParams);

  return (
    <Pager
      hasNext={hasNext}
      hasPrev={hasPrev}
      firstPage={firstPage}
      lastPage={lastPage}
      totalPages={totalPages}
      onSetPage={onSetPage}
      page={page}
    />
  );
};

ModelPager.propTypes = {
  resources: PropTypes.object
};

export default ModelPager;
