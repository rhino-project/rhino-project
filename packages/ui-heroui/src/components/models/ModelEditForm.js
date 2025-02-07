import { useModelEditContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { useRenderPaths } from '../../hooks/renderPaths';
import { ModelFieldGroup } from './ModelFieldGroup';
import { FormErrors } from '../forms/FormErrors';
import { Form } from '@heroui/react';

export const ModelEditFormBase = (props) => {
  const { model, paths } = useModelEditContext();
  const renderPaths = useRenderPaths(props.paths || paths, {
    Component: ModelFieldGroup,
    props: { model }
  });

  return (
    <Form>
      <FormErrors />
      {renderPaths}
    </Form>
  );
};

ModelEditFormBase.propTypes = {};

export const ModelEditForm = (props) =>
  useGlobalComponentForModel('ModelEditForm', ModelEditFormBase, props);
