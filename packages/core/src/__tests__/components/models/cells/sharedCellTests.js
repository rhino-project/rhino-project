import { render } from '@testing-library/react';
import * as rhinoConfig from 'rhino.config';

export const sharedCellTests = (Component) => {
  const nullGetValue = () => null;
  const Bar = (props) => <div>Bar</div>;

  it(`should render with global override shorthand`, async () => {
    const getValue = () => 'bar';
    const oldDefault = rhinoConfig.default;
    rhinoConfig.default = { version: 1, components: { [Component.name]: Bar } };

    const { asFragment } = render(
      <Component getValue={getValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();

    rhinoConfig.default = oldDefault;
  });

  it(`should render the empty text when value is nullish`, async () => {
    const { asFragment } = render(
      <Component getValue={nullGetValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the overridden empty text when value is nullish`, async () => {
    const { asFragment } = render(
      <Component empty="baz" getValue={nullGetValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
};
