import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormProvider from 'rhino/components/forms/FormProvider';
import ModelFieldGroup from 'rhino/components/models/ModelFieldGroup';
import { sharedModelTests } from './sharedModelTests';
import { ModelContext } from 'rhino/components/models/ModelProvider';
import { useModel } from 'rhino/hooks/models';

jest.mock('rhino/models', () => {
  const api = require('../../../shared/modelFixtures');
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('rhino/models');

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    default: {
      api: {
        ...api.default
      }
    }
  };
});

describe('ModelFieldGroup', () => {
  const wrapper = ({ children }) => {
    const methods = useForm();
    const model = useModel('user');
    return (
      <ModelContext.Provider value={{ model }}>
        <FormProvider {...methods}>{children}</FormProvider>
      </ModelContext.Provider>
    );
  };

  const Bar = (props) => <div {...props}>Bar</div>;

  sharedModelTests(ModelFieldGroup);

  it(`should merge overrides`, () => {
    const { asFragment } = render(
      <ModelFieldGroup
        model="user"
        path="name"
        overrides={{
          ModelFieldLayout: {
            ModelFieldLabel: Bar,
            ModelField: Bar
          }
        }}
      />,
      {
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
