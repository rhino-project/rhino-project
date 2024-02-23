import { useIdentifyAnalytics, useGroupAnalytics } from 'rhino/hooks/analytics';

export const IdentityAnalytics = ({ children }) => {
  useIdentifyAnalytics();
  useGroupAnalytics();

  return children;
};

export default IdentityAnalytics;
