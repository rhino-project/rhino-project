import { useModelCreateContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { useRenderPaths } from '../../hooks/renderPaths';
import { ModelFieldGroup } from './ModelFieldGroup';
import { FormErrors } from '../forms/FormErrors';
import { Form } from '@heroui/react';

export const ModelCreateFormBase = (props) => {
  const { paths } = useModelCreateContext();
  const renderPaths = useRenderPaths(props.paths || paths, {
    Component: ModelFieldGroup
  });

  return (
    <Form>
      <FormErrors />
      {renderPaths}
    </Form>
  );
};

ModelCreateFormBase.propTypes = {};

export const ModelCreateForm = (props) =>
  useGlobalComponentForModel('ModelCreateForm', ModelCreateFormBase, props);
