import { ReactNode } from 'react';
import { BaseAuthedPage } from '../BaseAuthedPage';
import { MaxWidth } from '../../components/layouts';

export const ModelPage = ({ children }: { children: ReactNode }) => {
  return (
    <BaseAuthedPage>
      <MaxWidth>{children}</MaxWidth>
    </BaseAuthedPage>
  );
};
