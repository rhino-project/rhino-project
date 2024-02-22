import { usePageAnalytics } from 'rhino/hooks/analytics';

export const PageAnalytics = ({ children }) => {
  usePageAnalytics();

  return children;
};

export default PageAnalytics;
