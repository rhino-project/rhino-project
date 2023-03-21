import { render } from '@testing-library/react';
import * as rhinoConfig from 'rhino.config';

const getBarValue = () => 'bar';

export const sharedCellTests = (Component) => {
  const nullGetValue = () => null;
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

    const { asFragment } = render(
      <Component getValue={getBarValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model`, async () => {
    rhinoConfig.default = {
      version: 1,
      components: { user: { [Component.name]: Bar } }
    };

    const { asFragment } = render(
      <Component getValue={getBarValue} model="user" path="name" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model and attribute`, async () => {
    rhinoConfig.default = {
      version: 1,
      components: { user: { name: { [Component.name]: Bar } } }
    };

    const { asFragment } = render(
      <Component getValue={getBarValue} model="user" path="name" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the empty text when value is nullish`, async () => {
    rhinoConfig.default = {
      version: 1,
      components: {}
    };

    const { asFragment } = render(
      <Component getValue={nullGetValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the overridden empty text when value is nullish`, async () => {
    rhinoConfig.default = {
      version: 1,
      components: {}
    };

    const { asFragment } = render(
      <Component empty="baz" getValue={nullGetValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
};
