import { useBaseOwnerPath } from 'rhino/hooks/history';
import { Link } from 'react-router-dom';
import { useRootPath } from 'rhino/hooks/routes';

const NotFoundPage = () => {
  const { build } = useBaseOwnerPath();
  const rootPath = useRootPath();
  return (
    <div>
      <h4>404 Page Not Found</h4>
      <Link to={build(rootPath)}> Go back to homepage </Link>
    </div>
  );
};

export default NotFoundPage;
