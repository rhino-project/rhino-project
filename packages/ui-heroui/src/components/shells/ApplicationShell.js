import PropTypes from 'prop-types';
import { useState } from 'react';
// import { LightLogo } from '../logos';
import { Sidebar } from './Sidebar';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { Icon } from '@iconify/react';

export const ApplicationShellBase = ({
  children,
  primaryNavigationElement = null,
  secondaryNavigationElement = null
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-full w-full items-start overflow-x-auto overflow-y-auto transition-colors duration-200 justify-start">
      <div className="h-full sticky top-0">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          primaryNavigationElement={primaryNavigationElement}
          secondaryNavigationElement={secondaryNavigationElement}
        />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open sidebar</span>
                <Icon className="w-8" icon="bi:list" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

ApplicationShellBase.propTypes = {
  children: PropTypes.node
};

export const ApplicationShell = (props) =>
  useGlobalComponent('ApplicationShell', ApplicationShellBase, props);
