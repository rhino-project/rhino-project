import { useTableInheritedProps } from '@rhino-project/core/hooks';

export const Header = ({ children, ...props }) => {
  const { inheritedProps } = useTableInheritedProps(props);

  return <div {...inheritedProps}>{children}</div>;
};
