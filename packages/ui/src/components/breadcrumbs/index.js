import PropTypes from 'prop-types';
import { BreadcrumbItem } from 'reactstrap';
import { useBaseOwnerPath } from '@rhino-project/core/hooks';

export const BreadcrumbItemWrapper = ({ tag, to, children, ...props }) => {
  const baseOwnerPath = useBaseOwnerPath();
  const path = baseOwnerPath.build(to);

  return (
    <BreadcrumbItem tag={tag} to={path} {...props}>
      {children}
    </BreadcrumbItem>
  );
};

BreadcrumbItemWrapper.propTypes = {
  tag: PropTypes.elementType,
  to: PropTypes.string,
  children: PropTypes.node
};
