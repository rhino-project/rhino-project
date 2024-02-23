import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormProvider from 'rhino/components/forms/FormProvider';
import ModelFilterGroup from 'rhino/components/models/ModelFilterGroup';
import { sharedModelTests } from './sharedModelTests';

describe('ModelFilterGroup', () => {
  const Wrapper = ({ children }) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  const Bar = (props) => <div {...props}>Bar</div>;

  sharedModelTests(ModelFilterGroup);

  it(`should merge overrides`, () => {
    const { asFragment } = render(
      <ModelFilterGroup
        model={{ properties: { dummy: { type: 'integer', minimum: 5 } } }}
        overrides={{
          FilterLayout: {
            FilterLabel: Bar,
            Filter: Bar
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
