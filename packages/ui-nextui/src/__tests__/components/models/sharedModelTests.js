import { render } from '@testing-library/react';
import rhinoConfig from 'rhino.config';

const getBarValue = () => 'bar';

export const sharedModelTests = (Component) => {
  const overrideName = Component.displayName || Component.name;
  const Bar = () => <div>Bar</div>;

  let configSpy;

  afterEach(() => {
    configSpy.mockRestore();
  });

  it(`should render with global override shorthand`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ [overrideName]: Bar });

    const { asFragment } = render(
      <Component getValue={getBarValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ user: { [overrideName]: Bar } });

    const { asFragment } = render(
      <Component getValue={getBarValue} model="user" path="name" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
};
