import * as devtool from './RhinoDevTool';

export const RhinoDevTool =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV !== 'development'
    ? function () {
        return null;
      }
    : devtool.RhinoDevTool;
