import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { FormProvider } from '../../../../components/forms/FormProvider';

const components = [
  'ModelFilterBoolean',
  'ModelFilterDate',
  'ModelFilterDateTime',
  'ModelFilterEnum',
  'ModelFilterFloat',
  'ModelFilterInteger',
  'ModelFilterIntegerSelect',
  'ModelFilterFloat',
  // FIXME: These components need more complex setu
  // 'ModelFilterOwnerReference',
  // 'ModelFilterReference',
  'ModelFilterTime',
  'ModelFilterYear'
];

describe('Common model filter behaviour', () => {
  const modulePath = 'rhino/components/models/filters';
  const Wrapper = ({ children }) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  components.forEach((component) => {
    it(`should render ${component}`, async () => {
      const module = await import(`${modulePath}/${component}`);
      const Component = module.default;
      const { asFragment } = render(
        <Component
          model={{ properties: { id: { type: 'identifier' }, dummy: {} } }}
          path="dummy"
        />,
        {
          wrapper: Wrapper
        }
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it(`should pass down arbitrary props ${component}`, async () => {
      const module = await import(`${modulePath}/${component}`);
      const Component = module.default;
      const { asFragment } = render(
        <Component
          model={{ properties: { dummy: {} } }}
          path="dummy"
          data-foo="bar"
        />,
        {
          wrapper: Wrapper
        }
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
