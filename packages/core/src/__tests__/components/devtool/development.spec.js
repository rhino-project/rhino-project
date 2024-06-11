import { render } from '@testing-library/react';
import { afterEach, describe } from 'vitest';

vi.stubEnv('NODE_ENV', 'development');

describe('RhinoDevTool development', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return devtool', async () => {
    const Devtool = await import('../../../components/devtool');
    const { asFragment } = render(<Devtool.RhinoDevTool />);
    expect(asFragment()).toMatchSnapshot();
  });
});
