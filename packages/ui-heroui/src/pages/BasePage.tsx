import { ReactNode } from '@tanstack/react-router';
import { ErrorBoundary } from '../components/errors/errorBoundary';

export const BasePage = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <div className="py-3">{children}</div>
    </ErrorBoundary>
  );
};
