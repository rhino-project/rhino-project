import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { compact, get, omit, set } from 'lodash';

import {
  getModelAndAttributeFromPath,
  getReferenceAttributes,
  getModelFromRef,
  getIdentifierAttribute
} from 'rhino/utils/models';
import { optionsFromIndexWithTitle, getDateTimeFormat } from 'rhino/utils/ui';
import { IconButton } from 'rhino/components/buttons';
import { format, parseISO } from 'date-fns';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import { usePaths } from 'rhino/hooks/paths';
import { useModelIndex } from 'rhino/hooks/queries';
import { IndeterminateCheckbox } from 'rhino/components/checkboxes';
import ModelFilterEnum from 'rhino/components/models/filters/ModelFilterEnum';

const operatorToLabel = (format, operator) => {
  if (['date', 'time', 'datetime'].includes(format)) {
    switch (operator) {
      case 'diff':
        return 'not';
      case 'gt':
      case 'gteq':
        return 'after';
      case 'lt':
      case 'lteq':
        return 'before';
      default:
        return '';
    }
  } else {
    return '';
  }
};

const ModelFilterLabel = ({
  attribute,
  path,
  operator,
  children,
  ...props
}) => (
  <Label for={path} {...props}>
    {children ||
      `${attribute.readableName} ${operatorToLabel(
        attribute.format,
        operator
      )}`}
  </Label>
);

ModelFilterLabel.propTypes = {
  attribute: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  children: PropTypes.node,
  operator: PropTypes.string
};

export const ModelAttributeReferenceFilter = ({
  attribute,
  operator,
  path,
  searchParams: { filter } = {},
  setSearchParams,
  addPills,
  pills
}) => {
  const model = useMemo(() => getModelFromRef(attribute), [attribute]);
  const identifier = useMemo(() => getIdentifierAttribute(model), [model]);

  const { data: { data: resources } = {} } = useModelIndex(model, {
    params: { limit: 100 }
  });

  // We inject the ID because if we have both 'engagement.project.client'
  // and 'engagement.project' as filters, setting engagement.project.client will
  // cause engagement.project to have an object as a value
  const idPath = `${path}.${identifier.name}`;
  const fullPath = compact([idPath, operator]).join('.');
  const value = useMemo(() => get(filter, fullPath), [filter, fullPath]);

  const hasSetPillsFirstTime = useRef(false);

  const handleChange = (e) => {
    // FIXME Is there a better way to fetch this?
    const index = e.target.selectedIndex;
    const name = e.nativeEvent.target[index].text;

    const newFilter = set(
      {
        filter: { ...filter }
      },
      `filter.${fullPath}`,
      e.target.value
    );
    setSearchParams(newFilter);
    addPills({ [fullPath]: name });
  };

  useEffect(() => {
    /*
    setting pill first time the filter is rendered,
    when the filter value has never changed and the 
    setSearchParams has never been called
    */
    if (
      !hasSetPillsFirstTime.current &&
      value != null &&
      pills != null &&
      pills[fullPath] == null &&
      resources?.results
    ) {
      hasSetPillsFirstTime.current = true;
      const resource = resources.results.find(
        (r) => `${r[identifier.name]}` === value
      );

      addPills({ [fullPath]: resource.display_name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, resources, pills]);

  return (
    <Input type="select" value={value || -1} onChange={handleChange}>
      {optionsFromIndexWithTitle(
        resources?.results,
        `${attribute.readableName}...`
      )}
    </Input>
  );
};

ModelAttributeReferenceFilter.propTypes = {
  attribute: PropTypes.object.isRequired,
  operator: PropTypes.string,
  path: PropTypes.string.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  addPills: PropTypes.func.isRequired,
  pills: PropTypes.object.isRequired
};

export const ModelAttributeIntegerFilter = ({
  attribute,
  operator,
  path,
  searchParams: { filter } = {},
  setSearchParams,
  addPills,
  pills
}) => {
  const fullPath = compact([path, operator]).join('.');
  const value = useMemo(() => get(filter, fullPath), [filter, fullPath]);

  const handleChange = (e) => {
    // FIXME Is there a better way to fetch this?
    const newValue = e.target.value?.toString();

    const newFilter = set(
      { filter: { ...filter } },
      `filter.${fullPath}`,
      newValue
    );
    setSearchParams(newFilter);
    addPills({ [fullPath]: newValue });
  };

  useEffect(() => {
    /*
    setting pill first time the filter is rendered,
    when the filter value has never changed and the 
    setSearchParams has never been called
    */
    if (value != null && pills[fullPath] == null) {
      addPills({ [fullPath]: value.toString() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Input
      type="number"
      value={value}
      onChange={handleChange}
      min={attribute.minimum}
      max={attribute.maximum}
    />
  );
};

ModelAttributeIntegerFilter.propTypes = {
  attribute: PropTypes.object.isRequired,
  operator: PropTypes.string,
  path: PropTypes.string.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired
};

export const ModelAttributeIntegerSelectFilter = ({
  attribute,
  operator,
  path,
  searchParams: { filter } = {},
  setSearchParams,
  addPills,
  pills
}) => {
  const integers = Array.from(
    { length: attribute.maximum - attribute.minimum },
    (x, i) => ({
      id: i + attribute.minimum,
      display_name: `${i + attribute.minimum}`
    })
  );

  const fullPath = compact([path, operator]).join('.');
  const value = useMemo(() => get(filter, fullPath), [filter, fullPath]);

  const handleChange = (e) => {
    // FIXME Is there a better way to fetch this?
    const index = e.target.selectedIndex;
    const name = e.nativeEvent.target[index].text;

    const newFilter = set(
      { filter: { ...filter } },
      `filter.${fullPath}`,
      e.target.value
    );
    setSearchParams(newFilter);
    addPills({ [fullPath]: name });
  };

  useEffect(() => {
    /*
    setting pill first time the filter is rendered,
    when the filter value has never changed and the 
    setSearchParams has never been called
    */
    if (value != null && pills[fullPath] == null) {
      const int = integers.find((i) => `${i.id}` === value);

      addPills({ [fullPath]: int.display_name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Input
      type="select"
      name={name}
      value={value || -1}
      onChange={handleChange}
    >
      {optionsFromIndexWithTitle(integers, `${attribute.readableName}...`)}
    </Input>
  );
};

ModelAttributeIntegerSelectFilter.propTypes = {
  attribute: PropTypes.object.isRequired,
  operator: PropTypes.string,
  path: PropTypes.string.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  addPills: PropTypes.func.isRequired,
  pills: PropTypes.object.isRequired
};

const buildDateTimePill = (attribute, operator, newValue) => {
  const date = typeof newValue === 'string' ? parseISO(newValue) : newValue;
  return `${attribute.readableName} ${operatorToLabel(
    attribute.format,
    operator
  )} ${format(date, getDateTimeFormat(attribute))}`;
};

export const ModelAttributeDateFilter = ({
  attribute,
  operator,
  path,
  searchParams: { filter } = {},
  setSearchParams,
  addPills,
  pills
}) => {
  const fullPath = compact([path, operator]).join('.');
  const valueRaw = get(filter, fullPath);
  const value = useMemo(
    () => (typeof valueRaw === 'string' ? parseISO(valueRaw) : null),
    [valueRaw]
  );

  const handleChange = (newValue) => {
    const newFilter = set(
      {
        filter: { ...filter }
      },
      `filter.${fullPath}`,
      newValue
    );
    setSearchParams(newFilter);
    addPills({
      [fullPath]: buildDateTimePill(attribute, operator, newValue)
    });
  };

  useEffect(() => {
    /*
    setting pill first time the filter is rendered,
    when the filter value has never changed and the 
    setSearchParams has never been called
    */
    if (value != null && pills[fullPath] == null) {
      addPills({
        [fullPath]: buildDateTimePill(attribute, operator, value)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DatePicker
      className={classnames('d-block', 'form-control')}
      selected={value}
      onChange={handleChange}
      showTimeSelect={
        attribute.format === 'time' || attribute.format === 'datetime'
      } //Time input can be text input too using 'showTimeInput'
      showTimeSelectOnly={attribute.format === 'time'}
      dateFormat={getDateTimeFormat(attribute)}
    />
  );
};

ModelAttributeDateFilter.propTypes = {
  attribute: PropTypes.object.isRequired,
  operator: PropTypes.string,
  path: PropTypes.string.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  addPills: PropTypes.func.isRequired,
  pills: PropTypes.object.isRequired
};

const buildBooleanPill = (attribute, newValue) => {
  const state = newValue === false ? 'Not ' : '';
  return `${state}${attribute.readableName}`;
};

const parseBooleanFilterValue = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return null;

  const normalized = value.trim().replace(/ /g, '').toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return null;
};

export const ModelAttributeBooleanFilter = ({
  attribute,
  operator,
  path,
  searchParams: { filter } = {},
  setSearchParams,
  addPills,
  pills
}) => {
  const fullPath = compact([path, operator]).join('.');
  const value = useMemo(() => parseBooleanFilterValue(get(filter, fullPath)), [
    filter,
    fullPath
  ]);

  const handleClick = (value) => {
    return () => {
      const newFilter = set(
        {
          filter: { ...filter }
        },
        `filter.${fullPath}`,
        value
      );
      setSearchParams(newFilter);
      addPills({
        [fullPath]: buildBooleanPill(attribute, value)
      });
    };
  };

  useEffect(() => {
    /*
    setting pill first time the filter is rendered,
    when the filter value has never changed and the 
    setSearchParams has never been called
    */
    if (value != null && pills[fullPath] == null) {
      addPills({ [fullPath]: buildBooleanPill(attribute, value) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IndeterminateCheckbox
      id={path}
      label={attribute.readableName}
      checked={value === true}
      indeterminate={value !== true && value !== false}
      onChange={handleClick(!value)}
    />
  );
};

ModelAttributeBooleanFilter.propTypes = {
  attribute: PropTypes.object.isRequired,
  operator: PropTypes.string,
  path: PropTypes.string.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  addPills: PropTypes.func.isRequired
};

const ModelFilters = ({
  model,
  paths,
  searchParams,
  setSearchParams,
  addPills,
  resetPills,
  pills
}) => {
  // Use passed in paths or compute a sensible set
  const pathsOrDefault = useMemo(
    () =>
      paths ||
      getReferenceAttributes(model)
        .filter(
          (a) => a.name !== model.ownedBy && !a.name.endsWith('_attachment')
        )
        .map((a) => a.name),
    [model, paths]
  );
  const computedPaths = usePaths(pathsOrDefault);

  const handleClear = (path) => {
    setSearchParams({
      ...searchParams,
      filter: omit(searchParams.filter, path)
    });
    addPills({ [path]: undefined });
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    setSearchParams({
      search: undefined,
      filter: undefined,
      order: undefined,
      offset: undefined,
      limit: undefined
    });
    // Every pill needs to be 'nulled' out
    resetPills();
  };

  return (
    <div className="d-flex flex-column my-2">
      <div className="row">
        {/* eslint-disable-next-line array-callback-return */}
        {computedPaths.map((p) => {
          const [
            attributeModel,
            attribute,
            operator,
            plainPath
          ] = getModelAndAttributeFromPath(model, p);

          // eslint-disable-next-line default-case
          switch (attribute.type) {
            case 'integer':
              switch (attribute.format) {
                case 'select':
                  return (
                    <FormGroup
                      key={p}
                      className="col-12 col-lg-4 d-flex flex-column"
                    >
                      <ModelFilterLabel
                        attribute={attribute}
                        path={plainPath}
                        operator={operator}
                      />
                      <ModelAttributeIntegerSelectFilter
                        key={p}
                        attribute={attribute}
                        operator={operator}
                        path={plainPath}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        addPills={addPills}
                        pills={pills}
                        className="col-12 col-lg-4"
                      />
                    </FormGroup>
                  );
                default:
                  return (
                    <FormGroup
                      key={p}
                      className="col-12 col-lg-4 d-flex flex-column"
                    >
                      <ModelFilterLabel
                        attribute={attribute}
                        path={plainPath}
                        operator={operator}
                      />
                      <ModelAttributeIntegerFilter
                        key={p}
                        attribute={attribute}
                        operator={operator}
                        path={plainPath}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        addPills={addPills}
                        pills={pills}
                        className="col-12 col-lg-4"
                      />
                    </FormGroup>
                  );
              }
            case 'reference':
              return (
                <FormGroup
                  key={p}
                  className="col-12 col-lg-4 d-flex flex-column"
                >
                  <ModelFilterLabel
                    attribute={attribute}
                    path={plainPath}
                    operator={operator}
                  />
                  <ModelAttributeReferenceFilter
                    key={p}
                    model={attributeModel}
                    attribute={attribute}
                    operator={operator}
                    path={plainPath}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    addPills={addPills}
                    pills={pills}
                    className="col-12 col-lg-4"
                  />
                </FormGroup>
              );
            case 'string':
              if (attribute?.enum) {
                return (
                  <FormGroup
                    key={p}
                    className="col-12 col-lg-4 d-flex flex-column"
                  >
                    <ModelFilterLabel
                      attribute={attribute}
                      path={plainPath}
                      operator={operator}
                    />
                    <ModelFilterEnum
                      model={attributeModel}
                      attribute={attribute}
                      operator={operator}
                      path={plainPath}
                      searchParams={searchParams}
                      setSearchParams={setSearchParams}
                      addPills={addPills}
                      pills={pills}
                    />
                  </FormGroup>
                );
              }

              switch (attribute.format) {
                case 'date':
                case 'time':
                case 'datetime':
                  return (
                    <FormGroup
                      key={p}
                      className="col-12 col-lg-4 d-flex flex-column"
                    >
                      <ModelFilterLabel
                        attribute={attribute}
                        path={plainPath}
                        operator={operator}
                      />
                      <ModelAttributeDateFilter
                        key={p}
                        model={attributeModel}
                        attribute={attribute}
                        operator={operator}
                        path={plainPath}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        addPills={addPills}
                        pills={pills}
                      />
                    </FormGroup>
                  );
                default:
                  console.assert(false, 'No available filter for ', attribute);
              }
              break;
            case 'boolean':
              return (
                <FormGroup
                  key={p}
                  className="col-12 col-lg-4 d-flex flex-column justify-content-center"
                >
                  <ModelAttributeBooleanFilter
                    model={attributeModel}
                    attribute={attribute}
                    operator={operator}
                    path={plainPath}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    addPills={addPills}
                    pills={pills}
                  />
                </FormGroup>
              );
            default:
              console.assert(false, 'No available filter for ', attribute);
          }
        })}
      </div>
      {computedPaths?.length > 0 && (
        <div className="row align-items-center m-2">
          {pills &&
            Object.keys(pills).map(
              (p) =>
                pills[p] != null && (
                  <IconButton
                    key={p}
                    icon="x"
                    color="light"
                    size="sm"
                    className="mr-2 mb-2"
                    onClick={() => handleClear(p)}
                  >
                    {pills[p]}
                  </IconButton>
                )
            )}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            href="#"
            className="mb-2 col-12 col-lg-auto"
            onClick={handleClearAll}
          >
            Clear all filters
          </a>
        </div>
      )}
    </div>
  );
};

ModelFilters.propTypes = {
  model: PropTypes.object.isRequired,
  paths: PropTypes.array,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  addPills: PropTypes.func.isRequired,
  resetPills: PropTypes.func.isRequired,
  pills: PropTypes.object
};

export default ModelFilters;
