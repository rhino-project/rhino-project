import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  useGlobalOverrides,
  useMergedOverrides,
  useOverrides
} from 'rhino/hooks/overrides';
import * as rhinoConfig from 'rhino.config';

vi.mock('rhino.config', () => ({
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
    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with style overrides', () => {
    const { asFragment } = render(
      <Foo overrides={{ Bar: { style: { color: 'red' } } }} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with props overrides', () => {
    const { asFragment } = render(
      <Foo overrides={{ Bar: { props: { className: 'Bar' } } }} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with explicit component overrides', () => {
    const { asFragment } = render(
      <Foo overrides={{ Bar: { component: Baz } }} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with shorthand component overrides', () => {
    const { asFragment } = render(<Foo overrides={{ Bar: Baz }} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with manually nested overrides', () => {
    const { asFragment } = render(
      <Another overrides={{ Foo: { props: { overrides: { Bar: Baz } } } }} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with automatically nested overrides', () => {
    const { asFragment } = render(
      <Another overrides={{ Foo: { Bar: Baz } }} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with null component', () => {
    const { asFragment } = render(<Foo overrides={{ Bar: null }} />);
    expect(asFragment()).toMatchSnapshot();
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

  const Foo = ({ overrides, ...props }) => {
    const C = useGlobalOverrides({ Bar }, overrides, props);
    return <C.Bar />;
  };

  beforeEach(() => {
    rhinoConfig.default = { version: 1, components: {} };
  });

  it('should render without overrides', () => {
    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global override shorthand', () => {
    rhinoConfig.default = { version: 1, components: { Bar: Baz } };
    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global override', () => {
    rhinoConfig.default = {
      version: 1,
      components: { Bar: { component: Baz } }
    };
    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global prop override', () => {
    rhinoConfig.default = {
      version: 1,
      components: { Bar: { props: { data: 'bar' } } }
    };
    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should be empty with null', () => {
    rhinoConfig.default = {
      version: 1,
      components: { Bar: null }
    };
    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should replace array prop', () => {
    rhinoConfig.default = {
      version: 1,
      components: { Bar: { props: { data: ['foo', 'bar'] } } }
    };
    const { asFragment } = render(
      <Foo overrides={{ Bar: { props: { data: ['baz'] } } }} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with local overrides instead of global overrides', () => {
    rhinoConfig.default = {
      version: 1,
      components: { Bar: { component: Baz } }
    };
    const { asFragment } = render(
      <Foo overrides={{ Bar: () => <div>Local</div> }} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with local props merged with global overrides component', () => {
    rhinoConfig.default = {
      version: 1,
      components: { Bar: { component: Baz } }
    };
    const { asFragment } = render(
      <Foo overrides={{ Bar: { props: { className: 'test' } } }} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  describe('for model', () => {
    it('should render with global override shorthand', () => {
      rhinoConfig.default = { version: 1, components: { user: { Bar: Baz } } };
      const { asFragment } = render(<Foo model="user" />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render with global override', () => {
      rhinoConfig.default = {
        version: 1,
        components: { user: { Bar: { component: Baz } } }
      };
      const { asFragment } = render(<Foo model="user" />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render with local overrides instead of global overrides', () => {
      rhinoConfig.default = {
        version: 1,
        components: { user: { Bar: { component: Baz } } }
      };
      const { asFragment } = render(
        <Foo overrides={{ Bar: () => <div>Local</div> }} model="user" />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render with local props merged with global overrides component', () => {
      rhinoConfig.default = {
        version: 1,
        components: { user: { Bar: { component: Baz } } }
      };
      const { asFragment } = render(
        <Foo
          overrides={{ Bar: { props: { className: 'test' } } }}
          model="user"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('for attribute', () => {
    it('should render with global override shorthand', () => {
      rhinoConfig.default = {
        version: 1,
        components: { user: { name: { Bar: Baz } } }
      };
      const { asFragment } = render(<Foo model="user" path="name" />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render with global override', () => {
      rhinoConfig.default = {
        version: 1,
        components: { user: { name: { Bar: { component: Baz } } } }
      };
      const { asFragment } = render(<Foo model="user" path="name" />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render with local overrides instead of global overrides', () => {
      rhinoConfig.default = {
        version: 1,
        components: { user: { name: { Bar: { component: Baz } } } }
      };
      const { asFragment } = render(
        <Foo
          overrides={{ Bar: () => <div>Local</div> }}
          model="user"
          path="name"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render with local props merged with global overrides component', () => {
      rhinoConfig.default = {
        version: 1,
        components: { user: { name: { Bar: { component: Baz } } } }
      };
      const { asFragment } = render(
        <Foo
          overrides={{ Bar: { props: { className: 'test' } } }}
          model="user"
          path="name"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
