import * as devtool from './RhinoDevTool';

export const RhinoDevTool =
  process.env.NODE_ENV !== 'development'
    ? function () {
        return null;
      }
    : devtool.RhinoDevTool;
