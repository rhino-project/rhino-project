import { renderHook } from '@testing-library/react-hooks';
import renderer from 'react-test-renderer';
import * as rhinoConfig from 'rhino.config';
import FilterLabel from 'rhino/components/forms/FilterLabel';
import fs from 'fs';

jest.mock('rhino.config', () => ({
  __esModule: true,
  default: null
}));

const components = ['FieldLabel', 'FilterLabel'];

describe('useGlobalOverrides for form components', () => {
  const modulePath = 'rhino/components/forms';

  const Bar = (props) => <div {...props}>Bar</div>;

  beforeEach(() => {
    rhinoConfig.default = { version: 1, components: {} };
  });

  components.forEach((component) => {
    it(`should render ${component} with global override shorthand`, async () => {
      const module = await import(`${modulePath}/${component}`);
      const Component = module.default;
      rhinoConfig.default = { version: 1, components: { [component]: Bar } };
      const renderedComponent = renderer.create(<Component path="dummy" />);
      expect(renderedComponent.toJSON()).toMatchSnapshot();
    });
  });
});
