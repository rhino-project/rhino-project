import { useRootPath } from '@rhino-project/core/hooks';
import { Link } from '@tanstack/react-router';
import { useBaseOwnerPath } from '../../hooks';

export const NotFoundPage = () => {
  const { build } = useBaseOwnerPath();
  const rootPath = useRootPath();
  return (
    <div>
      <h4>404 Page Not Found</h4>
      <Link to={build(rootPath)}> Go back to homepage </Link>
    </div>
  );
};
