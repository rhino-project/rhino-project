import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import rhinoConfig from 'rhino.config';
import { MemoryRouter } from 'react-router-dom';

const Wrapper = ({ children }) => {
  const methods = useForm();
  return (
    <MemoryRouter>
      <FormProvider {...methods}>{children}</FormProvider>
    </MemoryRouter>
  );
};

export const sharedDisplayTests = (Component) => {
  const Bar = () => <div>Bar</div>;

  let configSpy;

  afterEach(() => {
    configSpy.mockRestore();
  });

  it(`should render with global override shorthand`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ [Component.name]: Bar });

    const { asFragment } = render(<Component path="dummy" />, {
      wrapper: Wrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ user: { [Component.name]: Bar } });

    const { asFragment } = render(<Component model="user" path="name" />, {
      wrapper: Wrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model and attribute`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ user: { name: { [Component.name]: Bar } } });

    const { asFragment } = render(<Component model="user" path="name" />, {
      wrapper: Wrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the empty text when value is nullish`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(<Component path="dummy" />, {
      wrapper: Wrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the overridden empty text when value is nullish`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(<Component empty="baz" path="dummy" />, {
      wrapper: Wrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });
};
