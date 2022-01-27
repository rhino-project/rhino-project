import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ButtonGroup
} from 'reactstrap';
import { filter } from 'lodash';

import { getAttributeFromPath } from 'rhino/utils/models';
import { IconButton } from 'rhino/components/buttons';

const isDesc = (order) => order?.charAt(0) === '-';

const getSortableAttributes = (model) =>
  filter(
    model.properties,
    (a) =>
      a.type === 'string' ||
      a.type === 'datetime' ||
      a.type === 'float' ||
      a.type === 'integer'
  );

const ModelSort = ({
  model,
  paths,
  searchParams: { order } = {},
  setSearchParams
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const computedPaths = useMemo(
    () => paths || getSortableAttributes(model).map((a) => a.name),
    [model, paths]
  );

  const dropdownlist = computedPaths.map((p) => getAttributeFromPath(model, p));

  const currentSort = useMemo(
    () =>
      dropdownlist.filter((a) => a.name === order?.replace('-', ''))[0]
        ?.readableName || dropdownlist[0].readableName,
    [dropdownlist, order]
  );

  const sortType = useMemo(() => (isDesc(order) ? 'arrow-down' : 'arrow-up'), [
    order
  ]);

  const handleToggle = () => setIsOpen((prevState) => !prevState);

  const handleOrderChange = (order) => setSearchParams({ order });

  const handleDirectionChange = () => {
    // '-' before order makes the sort order DESC
    const newOrder = isDesc(order) ? order.replace('-', '') : '-' + order;
    setSearchParams({ order: newOrder });
  };

  return (
    <ButtonGroup>
      <Dropdown title={'Sort By:'} isOpen={isOpen} toggle={handleToggle}>
        <DropdownToggle caret>{currentSort}</DropdownToggle>
        <DropdownMenu>
          {dropdownlist.map((a) => (
            <DropdownItem
              key={a.name}
              onClick={() => handleOrderChange(a.name)}
            >
              {a.readableName}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      <IconButton icon={sortType} onClick={handleDirectionChange}></IconButton>
    </ButtonGroup>
  );
};

ModelSort.propTypes = {
  model: PropTypes.object.isRequired,
  paths: PropTypes.array,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired
};

export default ModelSort;
