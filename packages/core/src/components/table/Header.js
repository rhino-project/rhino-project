import { useTableInheritedProps } from '../../hooks/table';

export const Header = ({ children, ...props }) => {
  const { inheritedProps } = useTableInheritedProps(props);

  return <div {...inheritedProps}>{children}</div>;
};
