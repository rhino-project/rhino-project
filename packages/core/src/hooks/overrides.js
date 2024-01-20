import React, { useMemo } from 'react';
import {
  clone,
  cloneDeep,
  isArray,
  isFunction,
  isString,
  keys,
  merge,
  mergeWith
} from 'lodash';
import {
  useModel,
  useModelContext,
  useModelAndAttributeFromPath
} from './models';
import { NullComponent } from '../components/null';
import { useRhinoConfig } from '@rhino-project/config';

// Based on:
// https://medium.com/@dschnr/better-reusable-react-components-with-the-overrides-pattern-9eca2339f646
// https://github.com/tlrobinson/overrides

const arrayOverride = (objValue, srcValue) => {
  if (isArray(objValue)) {
    return [...srcValue];
  }
};

const maybeMerge = (a, b) => {
  return a && b ? { ...a, ...b } : a || b;
};

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

export const useGlobalComponent = (
  overrideName,
  BaseComponent,
  props,
  scope = {}
) => {
  const { components } = useRhinoConfig();
  const defaultComponents = useMemo(() => {
    return { [overrideName]: BaseComponent };
  }, [overrideName, BaseComponent]);

  const { attribute, attributeModel, model } = scope;

  const computedOverrides = useMemo(() => {
    const scopedOverrides = {};

    Object.keys(defaultComponents).forEach((key) => {
      // We can't directly use the globalOverrides object because it will mutate
      // So we shallow clone the globals and merge the overrides on top

      const overrideComponent = [
        // Attribute and attribute model overrides
        components?.[attributeModel?.model]?.[attribute?.name]?.[key],
        components?.[attributeModel?.model]?.[key],
        // Model overrides
        components?.[model?.model]?.[key],
        // Global overrides
        components[key]
        // Legacy overrides
      ].find((override) => override !== undefined);

      if (overrideComponent !== undefined) {
        scopedOverrides[key] = cloneDeep(expandOverride(overrideComponent));
      }
    });

    return mergeWith(
      scopedOverrides,
      // We need to replace arrays instead of merging them, for instance for
      // paths we want to replace
      arrayOverride
    );
  }, [components, defaultComponents, model, attributeModel, attribute]);

  const globalOverride = useOverrides(defaultComponents, computedOverrides);
  const GlobalOverrideComponent = globalOverride[overrideName];
  GlobalOverrideComponent.displayName = overrideName;

  return <GlobalOverrideComponent {...props} />;
};

export const useGlobalComponentForModel = (
  overrideName,
  BaseComponent,
  props,
  scope
) => {
  const { model } = useModelContext();
  const propModel = useModel(props?.model);

  // FIXME: The top level model is not always available right now
  // ModelIndex, ModelShow, ModelCreate, ModelEdit have model as a prop still

  const modelScope = useMemo(
    () => (model ? { model, ...scope } : { model: propModel, ...scope }),
    [model, propModel, scope]
  );

  return useGlobalComponent(overrideName, BaseComponent, props, modelScope);
};

export const useGlobalComponentForAttribute = (
  overrideName,
  BaseComponent,
  props,
  scope
) => {
  const { model: attributeModel, attribute } = useModelAndAttributeFromPath(
    props?.model,
    props?.path
  );

  const attributeScope = useMemo(
    () => ({ attributeModel, attribute, ...scope }),
    [attribute, attributeModel, scope]
  );

  return useGlobalComponentForModel(
    overrideName,
    BaseComponent,
    props,
    attributeScope
  );
};
