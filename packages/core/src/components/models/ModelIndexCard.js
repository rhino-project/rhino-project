import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Spinner
} from 'reactstrap';
import routePaths from 'rhino/routes';
import { get, filter } from 'lodash';
import classnames from 'classnames';
import { getAttributeFromPath } from 'rhino/utils/models';
import { getStringForDisplay, useModelClassNames } from 'rhino/utils/ui';

import { useOverrides } from 'rhino/hooks/overrides';
import { useBaseOwnerNavigation } from 'rhino/hooks/history';
import { usePaths } from 'rhino/hooks/paths';
import { useModelIndexContext } from 'rhino/hooks/controllers';

const ShowCardText = ({ model, attribute, path, resource }) => {
  const modelClassNames = useModelClassNames(
    'show-attribute',
    model,
    attribute
  );

  const displayString = getStringForDisplay(attribute, get(resource, path));
  return (
    <div className={modelClassNames}>
      {React.isValidElement(displayString) ? (
        <div>{displayString}</div>
      ) : (
        <div>{displayString}</div>
      )}
    </div>
  );
};

ShowCardText.propTypes = {
  attribute: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired
};

const getViewablePaths = (model) =>
  filter(model.properties, (a) => {
    return (
      a.type !== 'identifier' &&
      a.name !== model.ownedBy &&
      a.type !== 'array' &&
      a.type !== 'jsonb' &&
      a.type !== 'text' &&
      !a.name.endsWith('_attachment')
    );
  }).map((a) => (a.type === 'reference' ? `${a.name}.display_name` : a.name));

export const ModelCard = ({
  model,
  resource,
  displayAttributes,
  handleClick
}) => {
  const cardTextAttributes = displayAttributes.slice(2);
  const cardTitle = displayAttributes[0];
  const cardSubtitle = displayAttributes[1];

  const modelClassNamesTitle = useModelClassNames(
    'show-attribute',
    model,
    cardTitle.attribute
  );

  const modelClassNamesSubtitle = useModelClassNames(
    'show-attribute',
    model,
    cardSubtitle.attribute
  );

  return (
    <Card
      style={{ width: '320px' }}
      key={resource.id}
      className={classnames('model-card', 'm1')}
      onClick={() => handleClick(resource)}
    >
      <CardBody>
        <CardTitle tag="h5">
          <ShowCardText
            key={cardTitle.path}
            model={model}
            className={modelClassNamesTitle}
            attribute={cardTitle.attribute}
            path={cardTitle.path}
            resource={resource}
          />
        </CardTitle>
        <CardSubtitle tag="h6" className="mb-2 text-secondary">
          <ShowCardText
            key={cardSubtitle.path}
            model={model}
            className={modelClassNamesSubtitle}
            attribute={cardSubtitle.attribute}
            path={cardSubtitle.path}
            resource={resource}
          />
        </CardSubtitle>
        <CardText>
          {cardTextAttributes.map(({ path, attribute }) => (
            <ShowCardText
              key={path}
              model={model}
              attribute={attribute}
              path={path}
              resource={resource}
            />
          ))}
        </CardText>
      </CardBody>
    </Card>
  );
};

ModelCard.propTypes = {
  resource: PropTypes.object,
  model: PropTypes.object,
  displayAttributes: PropTypes.array,
  handleClick: PropTypes.func
};

const defaultComponents = {
  ModelCard
};

const ModelIndexCard = ({ overrides, paths, baseRoute }) => {
  const {
    model,
    isInitialLoading: loading,
    resources
  } = useModelIndexContext();

  const { ModelCard } = useOverrides(defaultComponents, overrides);
  const baseOwnerNavigation = useBaseOwnerNavigation();

  const handleClick = useCallback(
    (resource) => {
      baseOwnerNavigation.push(
        `${baseRoute}${routePaths[model.name].show(resource.id)}`
      );
    },
    [baseRoute, baseOwnerNavigation, model]
  );
  const pathsOrDefault = useMemo(() => paths || getViewablePaths(model), [
    paths,
    model
  ]);
  const computedPaths = usePaths(pathsOrDefault, resources);
  const displayAttributes = useMemo(
    () =>
      computedPaths.map((p) => ({
        path: p,
        attribute: getAttributeFromPath(model, p)
      })),
    [computedPaths, model]
  );

  if (loading) {
    return <Spinner className="mx-auto d-block" />;
  }

  return (
    <div className="d-flex flex-wrap">
      {resources?.results?.map((resource) => (
        <ModelCard
          key={resource.id}
          resource={resource}
          model={model}
          handleClick={handleClick}
          displayAttributes={displayAttributes}
        ></ModelCard>
      ))}
    </div>
  );
};

ModelIndexCard.propTypes = {
  overrides: PropTypes.object,
  baseRoute: PropTypes.string,
  paths: PropTypes.oneOfType([PropTypes.array, PropTypes.func])
};

ModelIndexCard.defaultProps = {
  baseRoute: '',
  loading: false
};

export default ModelIndexCard;
