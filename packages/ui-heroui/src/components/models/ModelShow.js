import PropTypes from 'prop-types';
import {
  useGlobalComponentForModel,
  useOverrides
} from '@rhino-project/core/hooks';
import { ModelShowDescription } from './ModelShowDescription';
import { ModelShowRelated } from './ModelShowRelated';
import { ModelShowActions } from './ModelShowActions';
import { ModelShowSimple } from './ModelShowSimple';
import { ModelShowHeader } from './ModelShowHeader';

const defaultComponents = {
  ModelShowHeader,
  ModelShowActions,
  ModelShowDescription,
  ModelShowRelated
};

export const ModelShowBase = ({ overrides, ...props }) => {
  const {
    ModelShowHeader,
    ModelShowActions,
    ModelShowDescription,
    ModelShowRelated
  } = useOverrides(defaultComponents, overrides);

  if (ModelShowDescription().props?.paths)
    console.warn('ModelShowDescription pass legacy paths prop');

  return (
    <ModelShowSimple paths={ModelShowDescription().props?.paths} {...props}>
      <ModelShowHeader />
      <div className="my-3">
        <ModelShowActions />
      </div>
      <ModelShowDescription />
      <ModelShowRelated />
    </ModelShowSimple>
  );
};

ModelShowBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  modelId: PropTypes.string.isRequired,
  overrides: PropTypes.object
};

export const ModelShow = (props) =>
  useGlobalComponentForModel('ModelShow', ModelShowBase, props);
