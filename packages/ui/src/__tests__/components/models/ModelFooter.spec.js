import { render } from '@testing-library/react';
import rhinoConfig from 'rhino.config';
import { ModelFooter } from '../../../components/models/ModelFooter';

describe('ModelFooter', () => {
  const Bar = () => <div>Bar</div>;

  let configSpy;

  afterEach(() => {
    configSpy.mockRestore();
  });

  it(`should render with global override shorthand`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ ModelFooter: Bar });

    const { asFragment } = render(<ModelFooter path="dummy" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ user: { ModelFooter: Bar } });

    const { asFragment } = render(<ModelFooter model="user" path="name" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render with global override shorthand for model and attribute`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ user: { name: { ModelFooter: Bar } } });

    const { asFragment } = render(<ModelFooter model="user" path="name" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the component with className from inherited props`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ version: 1, components: {} });

    const { asFragment } = render(
      <ModelFooter model="user" path="name" className="dummy-class" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the component with children`, async () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ version: 1, components: {} });

    const { asFragment } = render(
      <ModelFooter model="user" path="name">
        <div>Foo</div>
      </ModelFooter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
