import { render } from '@testing-library/react';
import rhinoConfig from 'rhino.config';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { ModelIndexTable } from '../../../../components/models/ModelIndexTable';
import { Children } from 'react';
import { createWrapper, RouterWrapper } from '../../../shared/helpers';

const getBarValue = () => 'bar';

export const sharedCellTests = (Component) => {
  const overrideName = Component.displayName || Component.name;
  const Bar = () => <div>Bar</div>;

  const IndexWrapper = ({ children }) => {
    return (
      <ModelIndexSimple
        fallback={false}
        model="user"
        queryOptions={{ enabled: false }}
      >
        <ModelIndexTable paths={Children.toArray(children)} />
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

    const { asFragment } = render(<Component getValue={getBarValue} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders inside of model context', () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});
    const { asFragment } = render(
      <IndexWrapper>
        <Component />
      </IndexWrapper>,
      {
        wrapper: createWrapper(RouterWrapper, { initialEntries: ['/1'] })
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
};
