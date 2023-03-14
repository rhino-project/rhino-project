import { useEffect, useState } from 'react';
import { InputGroup, Input } from 'reactstrap';
import { useDebouncedCallback } from 'use-debounce';
import { useModelIndexContext } from 'rhino/hooks/controllers';

const ModelSearch = (props) => {
  const { search, setSearch } = useModelIndexContext();
  const [searchTerm, setSearchTerm] = useState(search);
  const debounced = useDebouncedCallback((newSearch) => {
    setSearch(newSearch);
    return search;
  }, 200);

  const handleChange = ({ target: { value } }) => {
    setSearchTerm(value);

    // If its a value, we debounce it, otherwise set immediately because
    // its probably a clearing of the search input
    if (value) {
      debounced.callback(value);
    } else {
      setSearch(value);
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

ModelSearch.propTypes = {};

export default ModelSearch;
