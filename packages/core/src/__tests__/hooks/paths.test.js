import { renderHook } from '@testing-library/react';
import { useRoles } from '../../hooks/owner';
import { usePaths } from '../../hooks/paths';

vi.mock('../../hooks/owner', () => ({
  useRoles: vi.fn()
}));

describe('usePaths', () => {
  beforeEach(() => {
    useRoles.mockReturnValue(['role1', 'role2']);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns an empty array when paths is undefined', () => {
    const { result } = renderHook(() => usePaths(undefined, 'resource'));
    expect(result.current).toEqual([]);
  });

  it('returns the paths array when paths is an array', () => {
    const paths = ['path1', 'path2'];
    const { result } = renderHook(() => usePaths(paths));
    expect(result.current).toEqual(paths);
  });

  it('returns the computed paths when paths is a function', () => {
    const pathsFn = vi.fn(() => ['path1', 'path2']);
    const { result } = renderHook(() => usePaths(pathsFn, {}));
    expect(pathsFn).toHaveBeenCalledWith(['role1', 'role2'], {});
    expect(result.current).toEqual(['path1', 'path2']);
  });

  it('returns the unique paths based on user roles when paths is an object', () => {
    const paths = {
      role1: ['path1', 'path2'],
      role2: ['path3', 'path4']
    };
    const { result } = renderHook(() => usePaths(paths, 'resource'));
    expect(result.current).toEqual(['path1', 'path2', 'path3', 'path4']);
  });

  it('returns an empty array when user roles do not match any paths', () => {
    const paths = {
      role1: ['path1', 'path2'],
      role2: ['path3', 'path4']
    };
    useRoles.mockReturnValue(['role3']);
    const { result } = renderHook(() => usePaths(paths, 'resource'));
    expect(result.current).toEqual([]);
  });
});
