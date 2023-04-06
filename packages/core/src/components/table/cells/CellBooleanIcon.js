import { useMemo } from 'react';
import {Icon} from "rhino/components/icons";
import classNames from 'classnames';

const CellBooleanIcon = ({
  getValue,
  trueIcon = 'check',
  falseIcon = 'x',
  empty = 'dash'
}) => {
  const value = useMemo(() => {
    if (getValue() == null) return empty;

    return getValue() ? trueIcon : falseIcon;
  }, [empty, getValue, trueIcon, falseIcon]);

  const iconClass = useMemo(() =>
    classNames({
      'text-success': getValue() === true,
      'text-danger': getValue() === false
    }), [getValue]);

  return <Icon icon={value} className={iconClass} />;
};

export default CellBooleanIcon;
