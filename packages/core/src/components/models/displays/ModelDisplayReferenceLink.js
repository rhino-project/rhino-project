import { useMemo } from 'react';
import { IconButton } from 'rhino/components/buttons';
import { getAttributeFromPath, getModelFromRef } from 'rhino/utils/models';
import { getModelShowPath } from 'rhino/utils/routes';
import { NavLink } from 'react-router-dom';
import { useWatch } from 'react-hook-form';
import { useBaseOwnerPath } from 'rhino/hooks/history';
import { ModelDisplayReferenceBase } from './ModelDisplayReference';
import { Col, Row } from 'reactstrap';

const ModelDisplayReferenceLink = ({ model, ...props }) => {
  const { path } = props;
  const baseOwnerPath = useBaseOwnerPath();

  const watch = useWatch({ name: path });

  const referenceModel = useMemo(
    () => getModelFromRef(getAttributeFromPath(model, path)),
    [model, path]
  );

  const referenceShowPath = useMemo(() => {
    const showPath = getModelShowPath(referenceModel, watch?.id);
    return baseOwnerPath.build(showPath);
  }, [baseOwnerPath, referenceModel, watch?.id]);

  return (
    <Row>
      <Col sm={11}>
        <ModelDisplayReferenceBase {...props} />
      </Col>
      <Col sm={1}>
        <IconButton
          icon="box-arrow-up-right"
          className="btn-link bg-transparent"
          tag={NavLink}
          to={referenceShowPath}
          alt={`Go to the ${referenceModel.name}`}
          disabled={!watch?.id}
        />
      </Col>
    </Row>
  );
};

export default ModelDisplayReferenceLink;
