import { render } from '@testing-library/react';
import { ModelFieldGroupEnum } from '../../../../components/models/fieldGroups/ModelFieldGroupEnum';
import { sharedFieldGroupTests } from './sharedFieldGroupTests';
import { FormProvider, useForm } from 'react-hook-form';

const Wrapper = ({ children }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('ModelFieldGroupEnum', () => {
  sharedFieldGroupTests(ModelFieldGroupEnum);

  it(`should render a single child option`, async () => {
    const { asFragment } = render(
      <ModelFieldGroupEnum model="user" path="name">
        <option value="1">test option 1</option>
      </ModelFieldGroupEnum>,
      {
        wrapper: Wrapper
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render a multiple child options`, async () => {
    const { asFragment } = render(
      <ModelFieldGroupEnum model="user" path="name">
        <option value="1">test option 1</option>
        <option value="2">test option 2</option>
      </ModelFieldGroupEnum>,
      {
        wrapper: Wrapper
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
