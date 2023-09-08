import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import * as rhinoConfig from 'rhino.config';
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
  const Bar = (props) => <div>Bar</div>;

  let oldDefault;

  beforeEach(() => {
    oldDefault = rhinoConfig.default;
    rhinoConfig.default = { version: 1, components: {} };
  });

  afterEach(() => {
    rhinoConfig.default = oldDefault;
  });

  it(`should render with global override shorthand`, async () => {
    rhinoConfig.default = { version: 1, components: { [Component.name]: Bar } };

    const { asFragment } = render(<Component path="dummy" />, {
      wrapper: Wrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model`, async () => {
    rhinoConfig.default = {
      version: 1,
      components: { user: { [Component.name]: Bar } }
    };

    const { asFragment } = render(<Component model="user" path="name" />, {
      wrapper: Wrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model and attribute`, async () => {
    rhinoConfig.default = {
      version: 1,
      components: { user: { name: { [Component.name]: Bar } } }
    };

    const { asFragment } = render(<Component model="user" path="name" />, {
      wrapper: Wrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the empty text when value is nullish`, async () => {
    rhinoConfig.default = {
      version: 1,
      components: {}
    };

    const { asFragment } = render(<Component path="dummy" />, {
      wrapper: Wrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the overridden empty text when value is nullish`, async () => {
    rhinoConfig.default = {
      version: 1,
      components: {}
    };

    const { asFragment } = render(<Component empty="baz" path="dummy" />, {
      wrapper: Wrapper
    });
    expect(asFragment()).toMatchSnapshot();
  });
};
