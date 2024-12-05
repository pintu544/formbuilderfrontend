import OpenSidebarButton from "./OpenSidebarButton";

import Menu from "./Menu";
import MenuItem from "./MenuItem";

/* eslint-disable react/prop-types */
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside
      className={`bg-neutral-800 border-t border-solid border-t-neutral-700 h-[calc(100vh-64px)] fixed top-16 left-0 z-40 w-64 transition-transform -translate-x-full ${
        isSidebarOpen ? "translate-x-0" : "lg:translate-x-0"
      }`}
    >
      <div className="lg:hidden flex justify-end mt-2 mr-2">
        <OpenSidebarButton toggleSidebar={toggleSidebar} />
      </div>

      <Menu>
        <MenuItem path="/forms" text="Forms" />
      </Menu>
    </aside>
  );
};

export default Sidebar;
