import { render, renderHook } from '@testing-library/react';
import {
  useGlobalComponent,
  useGlobalComponentForAttribute,
  useGlobalComponentForModel,
  useMergedOverrides,
  useOverrides
} from '../../hooks/overrides';
import rhinoConfig from 'rhino.config';

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

describe('useGlobalComponent', () => {
  const Bar = (props) => <div {...props}>Bar</div>;

  const FooBase = (props) => {
    return <div {...props}>FooBase</div>;
  };

  const Foo = (props) => useGlobalComponent('Foo', FooBase, props);

  let configSpy;

  afterEach(() => {
    configSpy.mockRestore();
  });

  it('should render without overrides', () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global override shorthand', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: Bar });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global override', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: { component: Bar } });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global prop override', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: { props: { data: 'bar' } } });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should be empty with null', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: null });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  describe('for model', () => {
    it('should not render with global override shorthand', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { Foo: Bar } });

      const { asFragment } = render(<Foo model="user" />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should not render with global override', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { Foo: { component: Bar } } });

      const { asFragment } = render(<Foo model="user" />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('for attribute', () => {
    it('should not render with global override shorthand', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { name: { Foo: Bar } } });

      const { asFragment } = render(<Foo model="user" path="name" />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should not render with global override', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { name: { Foo: { component: Bar } } } });

      const { asFragment } = render(<Foo model="user" path="name" />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});

describe('useGlobalComponentForModel', () => {
  const Bar = (props) => <div {...props}>Bar</div>;

  const FooBase = (props) => {
    return <div {...props}>FooBase</div>;
  };

  const Foo = (props) => useGlobalComponentForModel('Foo', FooBase, props);

  let configSpy;

  afterEach(() => {
    configSpy.mockRestore();
  });

  it('should render without overrides', () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global override shorthand', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: Bar });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global override', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: { component: Bar } });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global prop override', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: { props: { data: 'bar' } } });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should be empty with null', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: null });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  describe('for model', () => {
    it('should render with global override shorthand', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { Foo: Bar } });

      const { asFragment } = render(<Foo model="user" />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render with global override', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { Foo: { component: Bar } } });

      const { asFragment } = render(<Foo model="user" />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('for attribute', () => {
    it('should not render with global override shorthand', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { name: { Foo: Bar } } });

      const { asFragment } = render(<Foo model="user" path="name" />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should not render with global override', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { name: { Foo: { component: Bar } } } });

      const { asFragment } = render(<Foo model="user" path="name" />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});

describe('useGlobalComponentForAttribute', () => {
  const Bar = (props) => <div {...props}>Bar</div>;

  const FooBase = (props) => {
    return <div {...props}>FooBase</div>;
  };

  const Foo = (props) => useGlobalComponentForAttribute('Foo', FooBase, props);

  let configSpy;

  afterEach(() => {
    configSpy.mockRestore();
  });

  it('should render without overrides', () => {
    configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({});

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global override shorthand', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: Bar });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global override', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: { component: Bar } });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with global prop override', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: { props: { data: 'bar' } } });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should be empty with null', () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ Foo: null });

    const { asFragment } = render(<Foo />);
    expect(asFragment()).toMatchSnapshot();
  });

  describe('for model', () => {
    it('should render with global override shorthand', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { Foo: Bar } });

      const { asFragment } = render(<Foo model="user" />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render with global override', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { Foo: { component: Bar } } });

      const { asFragment } = render(<Foo model="user" />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('for attribute', () => {
    it('should render with global override shorthand', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { name: { Foo: Bar } } });

      const { asFragment } = render(<Foo model="user" path="name" />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render with global override', () => {
      configSpy = vi
        .spyOn(rhinoConfig, 'components', 'get')
        .mockReturnValue({ user: { name: { Foo: { component: Bar } } } });

      const { asFragment } = render(<Foo model="user" path="name" />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
