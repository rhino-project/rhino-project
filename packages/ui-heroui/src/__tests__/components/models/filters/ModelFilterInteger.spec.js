import { render } from '@testing-library/react';
import { ModelFiltersSimple } from '../../../../components/models/ModelFiltersSimple';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { ModelFilterInteger } from '../../../../components/models/filters/ModelFilterInteger';
import { createWrapper, RouterWrapper } from '../../../shared/helpers';

describe('ModelFilterInteger', () => {
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
        <ModelFilterInteger path="words_min" />
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
        <ModelFilterInteger path="words_min_exclusive" />
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
        <ModelFilterInteger path="words_max" />
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
        <ModelFilterInteger path="words_max_exclusive" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
