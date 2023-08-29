import { each } from 'lodash';

import staticModels from 'models/static';

const MODEL_PATH = '/api/info/openapi';

const hoistRhino = (data) => {
  each(Object.keys(data.components.schemas), (schema) => {
    const model_uplifted = {
      ...data.components.schemas[schema]['x-rhino-model']
    };

    data.components.schemas[schema] = {
      ...data.components.schemas[schema],
      ...model_uplifted
    };

    // OpenAPI does required on the model level, we need it on the
    // attribute level
    const required = data.components.schemas[schema].required;

    each(
      Object.keys(data.components.schemas[schema].properties),
      (property) => {
        const attribute_uplifted = {
          ...data.components.schemas[schema].properties[property][
            'x-rhino-attribute'
          ]
        };

        if (required?.includes(property)) {
          attribute_uplifted['x-rhino-required'] = true;
        }

        data.components.schemas[schema].properties[property] = {
          ...data.components.schemas[schema].properties[property],
          ...attribute_uplifted
        };
      }
    );
  });

  return data;
};

class ModelLoader {
  async loadModels(forceStatic = false) {
    if (forceStatic || import.meta.env.PROD) {
      this.api = hoistRhino(staticModels);
    } else {
      const { networkApiCall } = await import('rhino/lib/networking');

      return networkApiCall(MODEL_PATH).then(
        (response) => (this.api = hoistRhino(response.data))
      );
    }
  }
}

export default new ModelLoader();
