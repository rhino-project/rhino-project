import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Input } from 'reactstrap';
import { useDebouncedCallback } from 'use-debounce';

const ModelSearch = ({ searchParams: { search } = {}, setSearchParams }) => {
  const [searchTerm, setSearchTerm] = useState(search);
  const debounced = useDebouncedCallback((search) => {
    setSearchParams({ search });
    return search;
  }, 200);

  const handleChange = ({ target: { value } }) => {
    setSearchTerm(value);

    // If its a value, we debounce it, otherwise set immediately because
    // its probably a clearing of the search input
    if (value) {
      debounced.callback(value);
    } else {
      setSearchParams({ search: value });
    }
  };

  // When the global search params change, we sync it back
  useEffect(() => setSearchTerm(search), [search]);

  return (
    <InputGroup>
      <Input
        type="search"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
    </InputGroup>
  );
};

ModelSearch.propTypes = {
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired
};

export default ModelSearch;
