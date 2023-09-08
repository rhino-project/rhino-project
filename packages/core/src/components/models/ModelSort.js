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
import { useModelIndexContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';

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

export const ModelSortBase = ({ paths }) => {
  const { model, order, setOrder } = useModelIndexContext();
  const [isOpen, setIsOpen] = useState(false);

  const computedPaths = useMemo(
    () => paths || getSortableAttributes(model).map((a) => a.name),
    [model, paths]
  );

  const dropdownlist = useMemo(() => {
    return computedPaths.map((computedPath) => {
      // Split multiple attributes
      const attributes = computedPath
        .split(',')
        .map((p) => getAttributeFromPath(model, p));

      return {
        name: computedPath,
        readableName: attributes.map((a) => a.readableName).join(', ')
      };
    });
  }, [computedPaths, model]);

  const currentSort = useMemo(
    () =>
      dropdownlist.filter((a) => a.name === order?.replace('-', ''))[0]
        ?.readableName || dropdownlist[0].readableName,
    [dropdownlist, order]
  );

  const sortType = useMemo(
    () => (isDesc(order) ? 'arrow-down' : 'arrow-up'),
    [order]
  );

  const handleToggle = () => setIsOpen((prevState) => !prevState);

  const handleOrderChange = (newOrder) => setOrder(newOrder);

  const handleDirectionChange = () => {
    // '-' before order makes the sort order DESC
    // FIXME: Mixed order ie '-name,description' are not supported
    const desc = isDesc(order);
    const attributes = order.split(',');

    const newOrder = desc
      ? attributes.map((a) => a.replace('-', '')).join(',')
      : '-' + attributes.join(',-');
    setOrder(newOrder);
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

ModelSortBase.propTypes = {
  paths: PropTypes.array
};

const ModelSort = (props) =>
  useGlobalComponent('ModelSort', ModelSortBase, props);

export default ModelSort;
