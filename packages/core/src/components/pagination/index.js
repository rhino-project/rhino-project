import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const PagerLink = ({ disabled, title, active, ...props }) => {
  return (
    <PaginationItem active={active} disabled={disabled}>
      <PaginationLink {...props}>{title}</PaginationLink>
    </PaginationItem>
  );
};

PagerLink.propTypes = {
  active: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  title: PropTypes.node
};

PagerLink.defaultProps = {
  active: false,
  disabled: false
};

export const CompactPager = ({ hasPrev, hasNext, page, onSetPage }) => {
  const handleClick = (page) => () => onSetPage(page);

  return (
    <Pagination size="sm">
      <PagerLink previous onClick={handleClick(page - 1)} disabled={!hasPrev} />
      <PagerLink next onClick={handleClick(page + 1)} disabled={!hasNext} />
    </Pagination>
  );
};

CompactPager.propTypes = {
  hasPrev: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  onSetPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired
};

export const Pager = ({
  hasPrev,
  hasNext,
  firstPage,
  lastPage,
  totalPages,
  page,
  onSetPage
}) => {
  const pages = Array.from(
    { length: lastPage - firstPage + 1 },
    (x, i) => firstPage + i
  );

  const handleClick = (page) => () => onSetPage(page);

  return (
    <Pagination>
      <PagerLink first onClick={handleClick(1)} disabled={!hasPrev} />
      <PagerLink previous onClick={handleClick(page - 1)} disabled={!hasPrev} />
      {pages.map((i) => (
        <PagerLink
          key={i}
          onClick={handleClick(i)}
          title={`${i}`}
          active={i === page}
        />
      ))}
      <PagerLink next onClick={handleClick(page + 1)} disabled={!hasNext} />
      <PagerLink last onClick={handleClick(totalPages)} disabled={!hasNext} />
    </Pagination>
  );
};

Pager.propTypes = {
  hasPrev: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  firstPage: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onSetPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired
};
