import React from 'react';
import renderer from 'react-test-renderer';
import { useOverrides } from 'rhino/hooks/overrides';

/* eslint react/display-name: 0, react/prop-types: 0 */
const TESTS = {
  'should render without overrides': ({ Foo }) => <Foo />,
  'should render with style overrides': ({ Foo }) => (
    <Foo overrides={{ Bar: { style: { color: 'red' } } }} />
  ),
  'should render with props overrides': ({ Foo }) => (
    <Foo overrides={{ Bar: { props: { className: 'Bar' } } }} />
  ),
  'should render with explicit component overrides': ({ Foo, Baz }) => (
    <Foo overrides={{ Bar: { component: Baz } }} />
  ),
  'should render with shorthand component overrides': ({ Foo, Baz }) => (
    <Foo overrides={{ Bar: Baz }} />
  ),
  // eslint-disable-next-line no-unused-vars
  'should render with manually nested overrides': ({ Another, Foo, Baz }) => (
    <Another overrides={{ Foo: { props: { overrides: { Bar: Baz } } } }} />
  ),
  'should render with automatically nested overrides': ({
    Another,
    // eslint-disable-next-line no-unused-vars
    Foo,
    Baz
  }) => <Another overrides={{ Foo: { Bar: Baz } }} />
};

function getUseOverridesComponents() {
  const Bar = (props) => <div {...props}>Bar</div>;
  const Baz = (props) => <div {...props}>Baz</div>;

  const Foo = ({ overrides }) => {
    const C = useOverrides({ Bar }, overrides);
    return <C.Bar />;
  };
  const Another = ({ overrides }) => {
    const C = useOverrides({ Foo, Wrapper: 'div' }, overrides);
    return (
      <C.Wrapper>
        <C.Foo />
      </C.Wrapper>
    );
  };

  return { Another, Foo, Bar, Baz };
}

const useOverridesComponents = getUseOverridesComponents();

function runAll(components) {
  Object.entries(TESTS).map(([name, fn]) =>
    it(name, () => {
      const component = renderer.create(fn(components));
      expect(component.toJSON()).toMatchSnapshot();
    })
  );
}

describe('useOverrides', () => {
  runAll(useOverridesComponents);
});
