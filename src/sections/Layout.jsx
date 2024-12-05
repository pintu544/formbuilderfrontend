import { useState, Suspense } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import OpenSidebarButton from "./Sidebar/OpenSidebarButton";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      <Header />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="lg:ml-64 mt-[70px] bg-neutral-50">
        <div className="lg:hidden mt-2 ml-2">
          <OpenSidebarButton toggleSidebar={toggleSidebar} />
        </div>
        <main className="min-h-[calc(100vh-72px)]">
          <Suspense
            fallback={
              <div className="w-full min-h-[calc(100vh-72px)] flex justify-center items-center">
                <div className="border-8 border-solid border-t-neutral-800 border-r-neutral-600 border-b-neutral-400 border-l-neutral-200 rounded-full w-20 h-20 animate-spin"></div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </>
  );
};

export default Layout;
