import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormProvider from 'rhino/components/forms/FormProvider';
import ModelFieldGroup from 'rhino/components/models/ModelFieldGroup';
import { sharedModelTests } from './sharedModelTests';

describe('ModelFieldGroup', () => {
  const wrapper = ({ children }) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  const Bar = (props) => <div {...props}>Bar</div>;

  sharedModelTests(ModelFieldGroup);

  it(`should merge overrides`, () => {
    const { asFragment } = render(
      <ModelFieldGroup
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
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
