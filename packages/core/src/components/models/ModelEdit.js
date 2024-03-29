import React from 'react';
import PropTypes from 'prop-types';

import {
  useGlobalComponentForModel,
  useOverrides
} from '../../hooks/overrides';
import { ModelEditHeader } from './ModelEditHeader';
import { ModelEditForm } from './ModelEditForm';
import { ModelEditActions } from './ModelEditActions';
import { ModelEditSimple } from './ModelEditSimple';
import { ModelSection } from './ModelSection';

const defaultComponents = {
  ModelEditHeader,
  ModelEditForm,
  ModelEditActions
};

export const ModelEditBase = ({ overrides, ...props }) => {
  const { ModelEditHeader, ModelEditForm, ModelEditActions } = useOverrides(
    defaultComponents,
    overrides
  );

  if (ModelEditForm().props?.paths)
    console.warn('ModelEditForm pass legacy paths prop');

  // Legacy path support over old overrides
  return (
    <ModelEditSimple paths={ModelEditForm().props?.paths} {...props}>
      <ModelSection baseClassName="edit">
        <ModelEditHeader />
        <ModelEditForm />
        <ModelEditActions />
      </ModelSection>
    </ModelEditSimple>
  );
};

ModelEditBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  overrides: PropTypes.object,
  paths: PropTypes.array,
  onActionError: PropTypes.func
};

export const ModelEdit = (props) =>
  useGlobalComponentForModel('ModelEdit', ModelEditBase, props);
