import { useIdentifyAnalytics, useGroupAnalytics } from '../../hooks/analytics';

export const IdentityAnalytics = ({ children }) => {
  useIdentifyAnalytics();
  useGroupAnalytics();

  return children;
};

export default IdentityAnalytics;
