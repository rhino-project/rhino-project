import React, { useMemo } from 'react';
import globalOverrides from 'models/overrides';
import rhinoConfig from 'rhino.config';
import { clone, cloneDeep, isFunction, isString, keys, merge } from 'lodash';

// Based on:
// https://medium.com/@dschnr/better-reusable-react-components-with-the-overrides-pattern-9eca2339f646
// https://github.com/tlrobinson/overrides

const maybeMerge = (a, b) => {
  return a && b ? { ...a, ...b } : a || b;
};

const NullComponent = () => null;

const isShortCut = (override) =>
  override === null ||
  isFunction(override) ||
  isString(override) ||
  override instanceof React.Component;

const expandOverride = (component) =>
  isFunction(component) ? { component } : clone(component);

const expandOverrides = (overrides) => {
  const scopedOverrides = {};

  // overrides can be null or undefined
  keys(overrides).forEach((key) => {
    const component = overrides[key];

    scopedOverrides[key] = expandOverride(component);
  });

  return scopedOverrides;
};

const getOverrides = (override, Component, props = {}) => {
  // component override shortcut:
  if (isShortCut(override)) {
    Component = override || NullComponent;
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

export const useMergedOverrides = (baseOverrides, overrides) => {
  const mergedOverrides = useMemo(() => {
    return merge(
      {},
      expandOverrides(baseOverrides),
      expandOverrides(overrides)
    );
  }, [baseOverrides, overrides]);

  return mergedOverrides;
};

export const useGlobalOverrides = (defaultComponents, overrides) => {
  const computedOverrides = useMemo(() => {
    const scopedOverrides = {};

    Object.keys(defaultComponents).forEach((key) => {
      // We can't directly use the globalOverrides object because it will mutate
      // So we shallow clone the globals and merge the overrides on top
      const globalComponent = cloneDeep(
        expandOverride(rhinoConfig.components[key])
      );

      scopedOverrides[key] = expandOverride(globalComponent);
    });

    return merge(scopedOverrides, expandOverrides(overrides));
  }, [defaultComponents, overrides]);

  return useOverrides(defaultComponents, computedOverrides);
};
