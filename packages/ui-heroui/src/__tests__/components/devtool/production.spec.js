import { render } from '@testing-library/react';
import { afterEach, describe } from 'vitest';

vi.stubEnv('NODE_ENV', 'production');

describe('RhinoDevTool production', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return null', async () => {
    const Devtool = await import('../../../components/devtool');
    const { asFragment } = render(<Devtool.RhinoDevTool />);
    expect(asFragment()).toMatchSnapshot();
  });
});
