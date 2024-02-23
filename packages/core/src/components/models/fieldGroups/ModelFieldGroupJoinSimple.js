import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelAndAttributeFromPath } from '../../../hooks/models';
import { useCallback, useId, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { Typeahead } from 'react-bootstrap-typeahead';
import { getModelFromRef, getReferenceAttributes } from '../../../utils/models';
import { useModelIndex } from '../../../hooks/queries';
import { useModelFieldGroup } from '../../../hooks/form';
import { FieldLayoutVerticalBase } from '../../forms/FieldLayoutVertical';
import { FieldLayoutHorizontalBase } from '../../forms/FieldLayoutHorizontal';
import FieldLayoutFloating from '../../forms/FieldLayoutFloating';

// FIXME: This might need to be refactored to use the useModelFieldGroup and/or have a generic typeahead component
export const ModelFieldJoinSimpleBaseInput = ({ model, ...props }) => {
  const { path, filter, limit = 100, offset, order } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const joinModel = useMemo(
    () =>
      getModelFromRef(
        getReferenceAttributes(refModel).filter(
          (a) => refModel.ownedBy !== a.name
        )[0]
      ),
    [refModel]
  );

  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const { results, isInitialLoading } = useModelIndex(joinModel, {
    filter,
    limit,
    offset,
    order
  });

  const options = useMemo(() => results || [], [results]);

  const currentOptions = useMemo(
    () =>
      value
        ?.filter((v) => v._destroy !== '1')
        ?.map((v) => v[joinModel.name].id || v[joinModel.name]) || [],
    [joinModel, value]
  );

  const selected = useMemo(
    () => options.filter((o) => currentOptions.includes(o.id)),
    [options, currentOptions]
  );

  const handleChange = useCallback(
    (selected) => {
      let newOptions = [...value];

      const selectedIds = selected.map((s) => s.id);

      // Find options that aren't already selected
      selectedIds.forEach((sp) => {
        const existing = newOptions.find(
          (pp) => pp[joinModel.name].id === sp || pp[joinModel.name] === sp
        );

        if (existing) {
          // In case it was previously destroyed, just un-destroy it
          delete existing._destroy;

          return;
        }

        newOptions.push({ [joinModel.name]: sp });
      });

      // Destroy options that are no longer selected
      newOptions = newOptions.map((pp) => {
        const exists =
          selectedIds.includes(pp[joinModel.name].id) ||
          selectedIds.includes(pp[joinModel.name]);

        if (exists) return pp;

        return { ...pp, _destroy: '1' };
      });

      onChange(newOptions);
    },
    [joinModel, onChange, value]
  );
  const id = useId();

  return (
    <Typeahead
      id={id}
      {...fieldProps}
      className={error ? 'is-invalid' : ''}
      inputProps={{ id: path }}
      clearButton={attribute.nullable}
      labelKey="display_name"
      multiple
      options={options}
      selected={selected}
      highlightOnlyResult
      isInvalid={!!error}
      onChange={handleChange}
      isLoading={isInitialLoading}
      {...props}
    />
  );
};

ModelFieldJoinSimpleBaseInput.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const BASE_OVERRIDES = {
  Field: ModelFieldJoinSimpleBaseInput
};

const ModelFieldGroupJoinSimpleVertical = (props) => {
  const { model, fieldGroupProps } = useModelFieldGroup(props);

  // FIXME: Merged overrides?
  return (
    // FIXME: Hack for ModelFieldReferenceBaseInput to do the query
    (<FieldLayoutVerticalBase
      overrides={BASE_OVERRIDES}
      model={model}
      {...fieldGroupProps}
    />)
  );
};

ModelFieldGroupJoinSimpleVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalJoinSimple = (props) => {
  const { model, fieldGroupProps } = useModelFieldGroup(props);

  return (
    <FieldLayoutHorizontalBase
      overrides={BASE_OVERRIDES}
      // FIXME: Hack for ModelFieldReferenceBaseInput to do the query
      model={model}
      {...fieldGroupProps}
    />
  );
};

export const ModelFieldGroupFloatingJoinSimple = (props) => {
  const { model, fieldGroupProps } = useModelFieldGroup(props);

  // FIXME: Merged overrides?
  return (
    // FIXME: Hack for ModelFieldReferenceBaseInput to do the query
    (<FieldLayoutFloating
      overrides={BASE_OVERRIDES}
      model={model}
      {...fieldGroupProps}
    />)
  );
};

const ModelFieldGroupJoinSimple = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupJoinSimple',
    ModelFieldGroupJoinSimpleVertical,
    props
  );

export default ModelFieldGroupJoinSimple;
