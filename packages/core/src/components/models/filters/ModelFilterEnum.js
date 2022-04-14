import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { capitalize, compact, get, set } from 'lodash';

import { optionsFromIndexWithTitle } from 'rhino/utils/ui';
import { useEffect, useMemo } from 'react';

const ModelFilterEnum = ({
  attribute,
  operator,
  path,
  searchParams: { filter } = {},
  setSearchParams,
  addPills,
  pills
}) => {
  const enums = useMemo(
    () =>
      attribute?.enum?.map((id) => ({
        display_name: capitalize(id),
        id
      })),
    [attribute]
  );

  const fullPath = compact([path, operator]).join('.');
  const value = useMemo(() => get(filter, fullPath), [filter, fullPath]);

  const handleChange = (e) => {
    const newFilter = set(
      { filter: { ...filter } },
      `filter.${fullPath}`,
      e.target.value
    );
    setSearchParams(newFilter);
  };

  useEffect(() => {
    const int = enums.find((i) => `${i.id}` === value);
    addPills({ [fullPath]: int?.display_name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      type="select"
      name={name}
      value={value || -1}
      onChange={handleChange}
    >
      {optionsFromIndexWithTitle(enums, `${attribute.readableName}...`)}
    </Input>
  );
};

ModelFilterEnum.propTypes = {
  attribute: PropTypes.object.isRequired,
  operator: PropTypes.string,
  path: PropTypes.string.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  addPills: PropTypes.func.isRequired,
  pills: PropTypes.object.isRequired
};

export default ModelFilterEnum;
