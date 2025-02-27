import { render } from '@testing-library/react';
import {
  ModelIndexSimple,
  ModelIndexTable
} from '../../../../components/models';
import { ModelCellIdentifier } from '../../../../components/models/cells/ModellCellIdentifier';
import { createWrapper, RouterWrapper } from '../../../shared/helpers';
import { sharedCellTests } from './sharedCellTests';

describe('ModelCellIdentifier', () => {
  sharedCellTests(ModelCellIdentifier);

  it('renders absolute link', () => {
    const { asFragment } = render(
      <ModelIndexSimple
        model="blog"
        queryOptions={{ initialData: { results: [{ id: 1 }] } }}
      >
        <ModelIndexTable paths={['id']} />
      </ModelIndexSimple>,
      {
        wrapper: createWrapper(RouterWrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
