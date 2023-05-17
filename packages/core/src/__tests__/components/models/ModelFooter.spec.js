import { render } from '@testing-library/react';
import * as rhinoConfig from 'rhino.config';
import ModelFooter from 'rhino/components/models/ModelFooter';

describe('ModelFooter', () => {
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
    rhinoConfig.default = { version: 1, components: { ModelFooter: Bar } };

    const { asFragment } = render(<ModelFooter path="dummy" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model`, async () => {
    rhinoConfig.default = {
      version: 1,
      components: { user: { ModelFooter: Bar } }
    };

    const { asFragment } = render(<ModelFooter model="user" path="name" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model and attribute`, async () => {
    rhinoConfig.default = {
      version: 1,
      components: { user: { name: { ModelFooter: Bar } } }
    };

    const { asFragment } = render(<ModelFooter model="user" path="name" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the component with className from inherited props`, async () => {
    rhinoConfig.default = { version: 1, components: {} };

    const { asFragment } = render(
      <ModelFooter model="user" path="name" className="dummy-class" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the component with children`, async () => {
    rhinoConfig.default = { version: 1, components: {} };

    const { asFragment } = render(
      <ModelFooter model="user" path="name">
        <div>Foo</div>
      </ModelFooter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
