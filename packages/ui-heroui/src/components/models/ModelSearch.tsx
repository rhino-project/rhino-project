import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useModelIndexContext } from '@rhino-project/core/hooks';
import { Input, InputProps } from '@heroui/react';

export const ModelSearch = (props: Partial<InputProps>) => {
  const { search, setSearch } = useModelIndexContext();
  const [searchTerm, setSearchTerm] = useState(search);
  const debounced = useDebouncedCallback((newSearch) => {
    setSearch(newSearch);
    return search;
  }, 200);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);

    // If its a value, we debounce it, otherwise set immediately because
    // its probably a clearing of the search input
    if (value) {
      debounced(value);
    } else {
      setSearch(value);
    }
  };

  // When the global search params change, we sync it back
  useEffect(() => setSearchTerm(search), [search]);

  return (
    <Input
      type="search"
      placeholder="Search"
      value={searchTerm}
      onChange={handleChange}
      {...props}
    />
  );
};
