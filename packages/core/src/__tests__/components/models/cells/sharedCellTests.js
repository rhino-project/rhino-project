import { render } from '@testing-library/react';
import rhinoConfig from 'rhino.config';

const getBarValue = () => 'bar';

export const sharedCellTests = (Component) => {
  const overrideName = Component.displayName || Component.name;
  const nullGetValue = () => null;
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

  it(`should render with global override shorthand for model and attribute`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ user: { name: { [overrideName]: Bar } } });

    const { asFragment } = render(
      <Component getValue={getBarValue} model="user" path="name" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the empty text when value is nullish`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(
      <Component getValue={nullGetValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the overridden empty text when value is nullish`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(
      <Component empty="baz" getValue={nullGetValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the component with className from inherited props`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(
      <Component
        empty="baz"
        getValue={nullGetValue}
        path="dummy"
        className="dummy-class"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
};
