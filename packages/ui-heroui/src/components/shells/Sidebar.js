import { Icon } from '@iconify/react';
import { LightLogo } from '../logos';

export function Sidebar({
  isOpen,
  toggleSidebar,
  primaryNavigationElement,
  secondaryNavigationElement
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-20 transition-opacity bg-primary opacity-50 lg:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`relative flex h-full w-72 flex-1 flex-col bg-primary p-6 lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        <div className="flex items-center justify-between flex-shrink-0 p-4">
          <LightLogo className="h-8" />
          <button
            onClick={toggleSidebar}
            className="p-1 transition-colors duration-200 rounded-md hover:text-gray-800 hover:bg-gray-100 lg:hidden"
          >
            <Icon className="size-6" icon="bi:x" />
          </button>
        </div>

        <div className="w-full relative flex flex-col gap-1 p-1 overflow-clip list-none">
          <nav className="space-y-1 ">{primaryNavigationElement}</nav>
        </div>

        <div className="w-full relative flex flex-col gap-1 p-1 overflow-clip mt-auto list-none">
          <nav className="space-y-1">{secondaryNavigationElement}</nav>
        </div>
      </div>
    </>
  );
}
