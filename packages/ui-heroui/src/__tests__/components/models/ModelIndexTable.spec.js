import { render } from '@testing-library/react';
import { sharedModelTests } from './sharedModelTests';
import { ModelIndexTable } from '../../../components/models/ModelIndexTable';
import { ModelIndexSimple } from '../../../components/models/ModelIndexSimple';
import { createWrapper, RouterWrapper } from '../../shared/helpers';

describe('ModelIndexTable', () => {
  const Foo = () => <div>Foo</div>;
  const Bar = () => <div>Bar</div>;
  const Baz = () => <div>Baz</div>;

  const IndexWrapper = ({ children }) => {
    return (
      <ModelIndexSimple
        model="user"
        fallback={false}
        queryOptions={{ enabled: false }}
      >
        {children}
      </ModelIndexSimple>
    );
  };

  const wrapper = createWrapper(RouterWrapper, {
    initialEntries: ['/1']
  });

  sharedModelTests(ModelIndexTable);

  it(`should allow local overrides`, async () => {
    const { asFragment } = render(
      <IndexWrapper>
        <ModelIndexTable
          overrides={{
            ModelHeader: Foo,
            ModelCell: Bar,
            ModelFooter: Baz
          }}
        />
      </IndexWrapper>,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it(`should allow local overrides of Table`, async () => {
    const { asFragment } = render(
      <IndexWrapper>
        <ModelIndexTable
          overrides={{
            Table: Foo
          }}
        />
      </IndexWrapper>,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
