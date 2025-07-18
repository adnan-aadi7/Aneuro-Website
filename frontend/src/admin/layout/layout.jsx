import React, { useState } from "react";
import Header from "../../admin/layout/header";
import Sidebar from "../../admin/layout/sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen ">
      <Sidebar
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <Header onHamburgerClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
