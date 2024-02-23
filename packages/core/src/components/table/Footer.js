import { useTableInheritedProps } from '../../hooks/table';

export const Footer = ({ children, ...props }) => {
  const { inheritedProps } = useTableInheritedProps(props);

  return <div {...inheritedProps}>{children}</div>;
};
