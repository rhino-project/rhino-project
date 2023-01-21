import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import renderer from 'react-test-renderer';
import {
  useGlobalOverrides,
  useMergedOverrides,
  useOverrides
} from 'rhino/hooks/overrides';
import * as rhinoConfig from 'rhino.config';

jest.mock('rhino.config', () => ({
  __esModule: true,
  default: null
}));

describe('useOverrides', () => {
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

  it('should render without overrides', () => {
    const component = renderer.create(<Foo />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with style overrides', () => {
    const component = renderer.create(
      <Foo overrides={{ Bar: { style: { color: 'red' } } }} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with props overrides', () => {
    const component = renderer.create(
      <Foo overrides={{ Bar: { props: { className: 'Bar' } } }} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with explicit component overrides', () => {
    const component = renderer.create(
      <Foo overrides={{ Bar: { component: Baz } }} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with shorthand component overrides', () => {
    const component = renderer.create(<Foo overrides={{ Bar: Baz }} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with manually nested overrides', () => {
    const component = renderer.create(
      <Another overrides={{ Foo: { props: { overrides: { Bar: Baz } } } }} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with automatically nested overrides', () => {
    const component = renderer.create(
      <Another overrides={{ Foo: { Bar: Baz } }} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe('useMergedOverrides', () => {
  const DummyComponent = () => <div />;
  const SecondDummyComponent = () => <div />;

  it('should expand with null overrides', () => {
    const { result } = renderHook(() =>
      useMergedOverrides({ Foo: DummyComponent }, null)
    );
    expect(result.current).toEqual({ Foo: { component: DummyComponent } });
  });

  it('should merge two shortcuts', () => {
    const { result } = renderHook(() =>
      useMergedOverrides({ Foo: DummyComponent }, { Foo: SecondDummyComponent })
    );
    expect(result.current).toEqual({
      Foo: { component: SecondDummyComponent }
    });
  });

  it('should merge a shortcut with a non-shortcut', () => {
    const { result } = renderHook(() =>
      useMergedOverrides(
        { Foo: DummyComponent },
        { Foo: { component: SecondDummyComponent } }
      )
    );
    expect(result.current).toEqual({
      Foo: { component: SecondDummyComponent }
    });
  });

  it('should merge a non-shortcut with a shortcut', () => {
    const { result } = renderHook(() =>
      useMergedOverrides(
        { Foo: { component: DummyComponent } },
        { Foo: SecondDummyComponent }
      )
    );
    expect(result.current).toEqual({
      Foo: { component: SecondDummyComponent }
    });
  });

  it('should merge two non-shortcuts', () => {
    const { result } = renderHook(() =>
      useMergedOverrides(
        { Foo: { component: DummyComponent } },
        { Foo: { component: SecondDummyComponent } }
      )
    );
    expect(result.current).toEqual({
      Foo: { component: SecondDummyComponent }
    });
  });

  it('should merge props with a shortcut', () => {
    const { result } = renderHook(() =>
      useMergedOverrides(
        { Foo: DummyComponent },
        { Foo: { props: { bar: 'bar' } } }
      )
    );
    expect(result.current).toEqual({
      Foo: { component: DummyComponent, props: { bar: 'bar' } }
    });
  });

  it('should merge shortcut with props', () => {
    const { result } = renderHook(() =>
      useMergedOverrides(
        { Foo: { props: { bar: 'bar' } } },
        { Foo: SecondDummyComponent }
      )
    );
    expect(result.current).toEqual({
      Foo: { component: SecondDummyComponent, props: { bar: 'bar' } }
    });
  });

  it('should preserve nested props', () => {
    const { result } = renderHook(() =>
      useMergedOverrides(
        { Foo: DummyComponent },
        { Foo: { Bar: { Baz: SecondDummyComponent } } }
      )
    );
    expect(result.current).toEqual({
      Foo: { component: DummyComponent, Bar: { Baz: SecondDummyComponent } }
    });

    const { result: result2 } = renderHook(() =>
      useMergedOverrides(
        { Foo: { Bar: { Baz: SecondDummyComponent } } },
        { Foo: DummyComponent }
      )
    );
    expect(result2.current).toEqual({
      Foo: { component: DummyComponent, Bar: { Baz: SecondDummyComponent } }
    });
  });
});

describe('useGlobalOverrides', () => {
  const Bar = (props) => <div {...props}>Bar</div>;
  const Baz = (props) => <div {...props}>Baz</div>;

  const Foo = ({ overrides }) => {
    const C = useGlobalOverrides({ Bar }, overrides);
    return <C.Bar />;
  };

  beforeEach(() => {
    rhinoConfig.default = { version: 1, components: {} };
  });

  it('should render without overrides', () => {
    const component = renderer.create(<Foo />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with global override shorthand', () => {
    rhinoConfig.default = { version: 1, components: { Bar: Baz } };
    const component = renderer.create(<Foo />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with global override', () => {
    rhinoConfig.default = {
      version: 1,
      components: { Bar: { component: Baz } }
    };
    const component = renderer.create(<Foo />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with local overrides instead of global overrides', () => {
    rhinoConfig.default = {
      version: 1,
      components: { Bar: { component: Baz } }
    };
    const component = renderer.create(
      <Foo overrides={{ Bar: () => <div>Local</div> }} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with local props merged with global overrides component', () => {
    rhinoConfig.default = {
      version: 1,
      components: { Bar: { component: Baz } }
    };
    const component = renderer.create(
      <Foo overrides={{ Bar: { props: { className: 'test' } } }} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
