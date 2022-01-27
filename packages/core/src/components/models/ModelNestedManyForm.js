import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormFeedback } from 'reactstrap';

import { useOverridesWithGlobal } from 'rhino/hooks/overrides';
import { getModelFromRef, getUpdatableAttributes } from 'rhino/utils/models';
import { useComputedPaths } from 'rhino/hooks/form';
import ModelTable, {
  ModelTableCellRenderer
} from 'rhino/components/models/ModelTable';
import ModelFormField from 'rhino/components/models/ModelFormField';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { IconButton } from 'rhino/components/buttons';

// Can't handle arrays when nested
const getNestedUpdatableAttributes = (model) =>
  getUpdatableAttributes(model).filter((a) => a.type !== 'array');

const ModelNestedCellRenderer = (props) => {
  const {
    data,
    editIndex,
    onChange,
    errors,
    column: { attribute },
    model,
    row,
    value
  } = props;
  const { name, creatable, updatable } = attribute;

  const errorKey = `${model.modelPlural}[${row.index}].${name}`;
  const error = errors?.[errorKey] ? { [name]: errors?.[errorKey] } : undefined;

  // ModelFormFieldReference will send back the full object as well
  const handleChange = (value, fullValue) => {
    const newValues = [...data];

    newValues[row.index][name] = fullValue || value[name];

    onChange(newValues);
  };

  // If its a new row, check creatable
  // If its an existing row, check updatable
  if (
    row.index === editIndex &&
    ((!row.original.id && creatable) || (row.original.id && updatable))
  )
    return (
      <>
        <ModelFormField
          attribute={attribute}
          path={name}
          errors={error}
          resource={{ [name]: value }}
          onChange={handleChange}
        />
        {error && <FormFeedback>{errors?.[errorKey]}</FormFeedback>}
      </>
    );

  return <ModelTableCellRenderer {...props} />;
};

ModelNestedCellRenderer.propTypes = {
  data: PropTypes.array.isRequired,
  editIndex: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  errors: PropTypes.object,
  model: PropTypes.object.isRequired,
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  resources: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired
};

const defaultComponents = {
  ModelTable
};

const ModelNestedManyForm = ({ overrides, ...props }) => {
  const { attribute, errors, paths, resources, onChange } = props;
  const model = getModelFromRef(attribute);

  const { ModelTable } = useOverridesWithGlobal(
    model,
    'nested',
    defaultComponents,
    overrides
  );
  const [editIndex, setEditIndex] = useState(false);
  const handleAdd = () => {
    const newValues = [...resources];
    newValues.unshift({});

    setEditIndex(0);

    onChange(newValues);
  };

  const handleEdit = useCallback((action, id, idx) => setEditIndex(idx), []);

  const handleDelete = useCallback(
    (action, id, idx) => {
      const newValues = [...resources];

      // Mark for destroy
      newValues[idx]._destroy = '1';

      // Reset edit index
      if (idx === editIndex) setEditIndex(false);

      onChange(newValues);
    },
    [resources, editIndex, onChange]
  );

  const computedPaths = useComputedPaths(
    model,
    paths,
    getNestedUpdatableAttributes
  );

  const filteredResources = useMemo(() => {
    if (!resources) return { results: [] };

    return { results: resources.filter((r) => r._destroy !== '1') };
  }, [resources]);

  const arrayOptions = attribute?.items?.['x-rhino-attribute-array'];

  const memberActions = useMemo(() => {
    const actions = [];

    if (arrayOptions?.updatable)
      actions.push({ name: 'edit', label: 'Edit', onAction: handleEdit });
    if (arrayOptions?.destroyable)
      actions.push({
        name: 'destroy',
        label: 'Delete',
        onAction: handleDelete
      });

    return actions;
  }, [arrayOptions, handleEdit, handleDelete]);

  return (
    <ModelWrapper model={model} {...props} baseClassName="nested">
      {arrayOptions?.creatable && (
        <IconButton icon="plus" outline onClick={handleAdd} />
      )}
      <ModelTable
        overrides={{
          ModelTableCellRenderer: {
            component: ModelNestedCellRenderer,
            props: { editIndex, errors, model, onChange: onChange }
          }
        }}
        memberActions={memberActions}
        model={model}
        resources={filteredResources}
        paths={computedPaths}
      />
    </ModelWrapper>
  );
};

ModelNestedManyForm.propTypes = {
  overrides: PropTypes.object,
  paths: PropTypes.array,
  resources: PropTypes.array,
  onChange: PropTypes.func,
  errors: PropTypes.object
};

export default ModelNestedManyForm;
