import { usePageAnalytics } from '../../hooks/analytics';

export const PageAnalytics = ({ children }) => {
  usePageAnalytics();

  return children;
};

export default PageAnalytics;
