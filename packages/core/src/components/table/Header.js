import { useTableInheritedProps } from 'rhino/hooks/table';

const Header = ({ children, ...props }) => {
  const { inheritedProps } = useTableInheritedProps(props);

  return <div {...inheritedProps}>{children}</div>;
};

export default Header;
