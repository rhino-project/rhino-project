import { render } from '@testing-library/react';
import { ModelFiltersSimple } from '../../../../components/models/ModelFiltersSimple';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { ModelFilterFloat } from '../../../../components/models/filters/ModelFilterFloat';
import { createWrapper, RouterWrapper } from '../../../shared/helpers';

describe('ModelFilterFloat', () => {
  const IndexWrapper = ({ children }) => {
    return (
      <ModelIndexSimple model="blog">
        <ModelFiltersSimple>{children}</ModelFiltersSimple>
      </ModelIndexSimple>
    );
  };

  const wrapper = createWrapper(RouterWrapper, {
    initialEntries: ['/1']
  });

  it(`adds min as a prop`, () => {
    const { asFragment } = render(
      <IndexWrapper>
        <ModelFilterFloat path="score_min" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`adds min as a prop with exclusiveMinimum`, () => {
    const { asFragment } = render(
      <IndexWrapper>
        <ModelFilterFloat path="score_min_exclusive" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`adds max as a prop`, () => {
    const { asFragment } = render(
      <IndexWrapper>
        <ModelFilterFloat path="score_max" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`adds max as a prop with exclusiveMaximum`, () => {
    const { asFragment } = render(
      <IndexWrapper>
        <ModelFilterFloat path="score_max_exclusive" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
