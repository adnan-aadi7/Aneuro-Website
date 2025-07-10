import React, { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#16161C] relative">
      {/* Sidebar: overlay on mobile, static on md+ */}
      <div className="flex flex-row min-h-screen bg-[#16161C] relative">
        {/* Sidebar: overlay on mobile, static on md+ */}
        <div
          className={
            sidebarOpen
              ? "fixed top-0 left-0 z-40 flex md:static md:inset-auto md:z-auto"
              : "hidden md:flex md:static md:inset-auto md:z-auto"
          }
        >
          <Sidebar
            sidebarOpen={sidebarOpen}
            onSidebarClose={() => setSidebarOpen(false)}
          />
        </div>
        {/* Main area: header + content */}
        <div className="flex flex-col flex-1 min-w-0 relative">
          <Header onHamburgerClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 w-full max-w-full overflow-x-auto relative z-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
