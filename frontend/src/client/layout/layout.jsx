import Header from "./header";
import Sidebar from "./sidebar";

const AdminLayout = ({ children, headerChildren }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#16161C] text-black">
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Optional Header */}
         <Header>{headerChildren}</Header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-8 w-full mx-auto max-w-screen-2xl 2xl:max-w-[2000px]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
