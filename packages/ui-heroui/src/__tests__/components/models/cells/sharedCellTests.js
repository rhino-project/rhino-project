import { render } from '@testing-library/react';
import rhinoConfig from 'rhino.config';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { createWrapper, RouterWrapper } from '../../../shared/helpers';

const getBarValue = () => 'bar';

// FIXME: We are using fields here that are neccessarily valid for the component under test
// FIXME: We should probably take a model/path as an argument and use that to determine the fields
export const sharedCellTests = (Component) => {
  const overrideName = Component.displayName || Component.name;
  const nullGetValue = () => null;
  const Bar = () => <div>Bar</div>;

  const IndexWrapper = ({ children }) => {
    return (
      <ModelIndexSimple
        model="blog"
        fallback={false}
        queryOptions={{ disabled: true }}
      >
        {children}
      </ModelIndexSimple>
    );
  };

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
      <IndexWrapper>
        <Component getValue={nullGetValue} path="id" />
      </IndexWrapper>,
      { wrapper: createWrapper(RouterWrapper, { initialEntries: ['/1'] }) }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the overridden empty text when value is nullish`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(
      <IndexWrapper>
        <Component empty="baz" getValue={nullGetValue} path="id" />
      </IndexWrapper>,
      { wrapper: createWrapper(RouterWrapper, { initialEntries: ['/1'] }) }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should render the component with className from inherited props`, async () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(
      <IndexWrapper>
        <Component
          empty="baz"
          getValue={nullGetValue}
          path="id"
          className="dummy-class"
        />
      </IndexWrapper>,
      { wrapper: createWrapper(RouterWrapper, { initialEntries: ['/1'] }) }
    );
    expect(asFragment()).toMatchSnapshot();
  });
};
