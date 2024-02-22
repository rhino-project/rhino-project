import { useBaseOwnerPath } from '../../hooks/history';
import { Link } from 'react-router-dom';
import { useRootPath } from '../../hooks/routes';

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
