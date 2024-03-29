import PropTypes from 'prop-types';

import {
  useGlobalComponentForModel,
  useOverrides
} from '../../hooks/overrides';
import { ModelCreateHeader } from './ModelCreateHeader';
import { ModelCreateForm } from './ModelCreateForm';
import { ModelCreateActions } from './ModelCreateActions';
import { ModelCreateSimple } from './ModelCreateSimple';
import { ModelSection } from './ModelSection';

const defaultComponents = {
  ModelCreateHeader,
  ModelCreateForm,
  ModelCreateActions
};

export const ModelCreateBase = ({ overrides, ...props }) => {
  const { ModelCreateHeader, ModelCreateForm, ModelCreateActions } =
    useOverrides(defaultComponents, overrides);

  if (ModelCreateForm().props?.paths)
    console.warn('ModelCreateForm pass legacy paths prop');

  return (
    <ModelCreateSimple paths={ModelCreateForm().props?.paths} {...props}>
      <ModelSection baseClassName="create">
        <ModelCreateHeader />
        <ModelCreateForm />
        <ModelCreateActions />
      </ModelSection>
    </ModelCreateSimple>
  );
};

ModelCreateBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  overrides: PropTypes.object
};

export const ModelCreate = (props) =>
  useGlobalComponentForModel('ModelCreate', ModelCreateBase, props);
