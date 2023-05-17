import { render } from '@testing-library/react';
import * as rhinoConfig from 'rhino.config';

const getBarValue = () => 'bar';

export const sharedModelTests = (Component) => {
  const overrideName = Component.displayName || Component.name;
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
    rhinoConfig.default = {
      version: 1,
      components: { [overrideName]: Bar }
    };

    const { asFragment } = render(
      <Component getValue={getBarValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model`, async () => {
    rhinoConfig.default = {
      version: 1,
      components: { user: { [overrideName]: Bar } }
    };

    const { asFragment } = render(
      <Component getValue={getBarValue} model="user" path="name" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
};
