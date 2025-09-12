import Header from "./header";
import Sidebar from "./sidebar";
import { useState } from "react";
const AdminLayout = ({ children, headerChildren }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen w-full   text-black">
 <Sidebar
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
      />
      {/* Main content area */}
      <div className="flex flex-col flex-1 h-full bg-black  overflow-hidden">
        {/* Optional Header */}
         <Header onHamburgerClick={() => setSidebarOpen(true)}>{headerChildren}</Header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-10 w-full mx-auto max-w-screen-2xl 2xl:max-w-full ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
