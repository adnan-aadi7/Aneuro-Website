import React, { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#16161C]">
      <Sidebar
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1">
        <Header onHamburgerClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
