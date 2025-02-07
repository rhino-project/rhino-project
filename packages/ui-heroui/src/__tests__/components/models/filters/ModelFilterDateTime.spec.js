import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModelFiltersSimple } from '../../../../components/models/ModelFiltersSimple';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { ModelFilterDateTime } from '../../../../components/models/filters/ModelFilterDateTime';
import { FilterDateTime } from '../../../../Filter';
import { ZonedDateTime } from '@internationalized/date';

vi.mock('../../../../Filter', () => ({
  FilterDateTime: vi.fn(() => null)
}));

describe('ModelFilterDateTime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    render(
      <ModelFilterDateTime
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              minimum: '1982-02-07T05:00:00.000Z'
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(FilterDateTime).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: new ZonedDateTime(1982, 2, 7, 'America/Toronto', -18000000),
        maxValue: undefined,
        path: 'dummy'
      }),
      expect.anything()
    );
  });

  it(`adds min as a prop with exclusiveMinimum`, () => {
    render(
      <ModelFilterDateTime
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              minimum: '1982-02-07T05:00:00.000Z',
              exclusiveMinimum: true
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );
    expect(FilterDateTime).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: new ZonedDateTime(
          1982,
          2,
          7,
          'America/Toronto',
          -18000000,
          0,
          0,
          1
        ),
        maxValue: undefined,
        path: 'dummy'
      }),
      expect.anything()
    );
  });

  it(`adds max as a prop`, () => {
    render(
      <ModelFilterDateTime
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              maximum: '2030-02-07T05:00:00.000Z'
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(FilterDateTime).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: undefined,
        maxValue: new ZonedDateTime(2030, 2, 7, 'America/Toronto', -18000000),
        path: 'dummy'
      }),
      expect.anything()
    );
  });

  it(`adds max as a prop with exclusiveMaximum`, () => {
    render(
      <ModelFilterDateTime
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              maximum: '2030-02-07T05:00:00.000Z',
              exclusiveMaximum: true
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(FilterDateTime).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: undefined,
        maxValue: new ZonedDateTime(
          2030,
          2,
          6,
          'America/Toronto',
          -18000000,
          23,
          59,
          59
        ),
        path: 'dummy'
      }),
      expect.anything()
    );
  });
});
