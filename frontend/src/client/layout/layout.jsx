import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#16161C]">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
