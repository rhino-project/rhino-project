import React from 'react';
import globalOverrides from 'models/overrides';

// Based on:
// https://medium.com/@dschnr/better-reusable-react-components-with-the-overrides-pattern-9eca2339f646
// https://github.com/tlrobinson/overrides

const maybeMerge = (a, b) => {
  return a && b ? { ...a, ...b } : a || b;
};

const getOverrides = (override, Component, props = {}) => {
  // component override shortcut:
  if (
    typeof override === 'function' ||
    typeof override === 'string' ||
    override instanceof React.Component
  ) {
    Component = override;
  } else if (override) {
    const { style, props: propsOverride, component, ...nested } = override;
    // assume at least one of the folllowing will override props, so clone
    props = { ...props };
    // component override:
    if (component) {
      Component = component;
    }
    // props override:
    if (propsOverride) {
      Object.assign(props, propsOverride);
    }
    // style override:
    if (style) {
      props.style = maybeMerge(
        props.style,
        typeof style === 'function' ? style(props) : style
      );
      // TODO: support $style?
      // props.$style = style;
    }
    // nested overrides:
    if (Object.keys(nested).length > 0) {
      props.overrides = maybeMerge(props.overrides, nested);
    }
  }
  return [Component, props];
};

const initializeOverrideWrappers = (defaultComponents, getOverridesProp) => {
  // initialize component wrappers
  const components = {};
  for (const name of Object.keys(defaultComponents)) {
    components[name] = (props) => {
      const overrides = getOverridesProp() || {};
      // eslint-disable-next-line no-unused-vars
      const override = overrides[name];

      const [Component, mergedProps] = getOverrides(
        overrides[name],
        defaultComponents[name],
        props
      );

      return <Component {...mergedProps} />;
    };
    components[name].displayName = `${name}Overridable`;
  }
  return components;
};

export const useOverrides = (defaultComponents, overrides) => {
  const overridesRef = React.useRef(overrides);
  overridesRef.current = overrides;
  return React.useMemo(
    () =>
      initializeOverrideWrappers(defaultComponents, () => overridesRef.current),
    [defaultComponents]
  );
};

export const useOverridesWithGlobal = (
  model,
  base,
  defaultComponents,
  overrides
) => {
  return useOverrides(
    defaultComponents,
    overrides || globalOverrides?.[model.model]?.[base]
  );
};
