import { useTableInheritedProps } from 'rhino/hooks/table';

const Footer = ({ children, ...props }) => {
  const { inheritedProps } = useTableInheritedProps(props);

  return <div {...inheritedProps}>{children}</div>;
};

export default Footer;
