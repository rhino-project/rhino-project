import React from 'react';
import PropTypes from 'prop-types';

import { usePaginationParams } from 'rhino/hooks/history';
import { Pager } from 'rhino/components/pagination';

const ModelPager = ({ resources }) => {
  const [
    hasPrev,
    hasNext,
    firstPage,
    lastPage,
    totalPages,
    onSetPage,
    page
  ] = usePaginationParams(resources?.total);

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
