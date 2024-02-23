import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ModelFiltersSimple from '../../../../components/models/ModelFiltersSimple';
import ModelIndexSimple from '../../../../components/models/ModelIndexSimple';
import ModelFilterFloat from '../../../../components/models/filters/ModelFilterFloat';

describe('ModelFilterFloat', () => {
  const Wrapper = ({ children, ...props }) => {
    const queryClient = new QueryClient();

    return (
      <MemoryRouter {...props}>
        <QueryClientProvider client={queryClient}>
          <ModelIndexSimple model="blog">
            <ModelFiltersSimple>{children}</ModelFiltersSimple>
          </ModelIndexSimple>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  it(`adds min as a prop`, () => {
    const { asFragment } = render(
      <ModelFilterFloat
        model={{ properties: { dummy: { type: 'integer', minimum: 5 } } }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`adds min as a prop with exclusiveMinimum`, () => {
    const { asFragment } = render(
      <ModelFilterFloat
        model={{
          properties: {
            dummy: { type: 'integer', minimum: 5, exclusiveMinimum: true }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`adds max as a prop`, () => {
    const { asFragment } = render(
      <ModelFilterFloat
        model={{ properties: { dummy: { type: 'integer', maximum: 5 } } }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`adds max as a prop with exclusiveMaximum`, () => {
    const { asFragment } = render(
      <ModelFilterFloat
        model={{
          properties: {
            dummy: { type: 'integer', maximum: 5, exclusiveMaximum: true }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
