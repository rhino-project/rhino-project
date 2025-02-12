import { useModelShowContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { useRenderPaths } from '../../hooks/renderPaths';
import { ModelDisplayGroup } from './ModelDisplayGroup';
import { FormErrors } from '../forms/FormErrors';
import { Form } from '@heroui/react';

export const ModelShowDescriptionBase = (props) => {
  const { paths } = useModelShowContext();
  const renderPaths = useRenderPaths(props.paths || paths, {
    Component: ModelDisplayGroup
  });

  return (
    <Form>
      <FormErrors />
      {renderPaths}
    </Form>
  );
};

ModelShowDescriptionBase.propTypes = {};

export const ModelShowDescription = (props) =>
  useGlobalComponentForModel(
    'ModelShowDescription',
    ModelShowDescriptionBase,
    props
  );
