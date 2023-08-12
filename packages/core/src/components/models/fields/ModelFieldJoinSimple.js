import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useController } from 'react-hook-form';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';
import { useModelIndex } from 'rhino/hooks/queries';
import { getModelFromRef, getReferenceAttributes } from 'rhino/utils/models';

export const ModelFieldJoinSimpleBase = ({ model, ...props }) => {
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

  return (
    <Typeahead
      id={path}
      {...fieldProps}
      className={error ? 'is-invalid' : ''}
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

ModelFieldJoinSimpleBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldJoinSimple = (props) =>
  useGlobalComponent('ModelFieldJoinSimple', ModelFieldJoinSimpleBase, props);

export default ModelFieldJoinSimple;
