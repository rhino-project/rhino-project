import { useBaseOwnerPath } from 'rhino/hooks/history';
import { Link } from 'react-router-dom';
import routePaths from 'rhino/routes';

const NotFoundPage = () => {
  const { build } = useBaseOwnerPath();
  return (
    <div>
      <h4>404 Page Not Found</h4>
      <Link to={build(routePaths.rootpath())}> Go back to homepage </Link>
    </div>
  );
};

export default NotFoundPage;
