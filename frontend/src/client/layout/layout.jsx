import Header from "./header";
import Sidebar from "./sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminLayout = ({ children, headerChildren }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Grab user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);

      const hasActiveSubscription =
        user?.subscription &&
        user.subscription.plan &&
        user.subscription.status === "active";

      if (!hasActiveSubscription) {
        // 🚨 Redirect if no active subscription
        navigate("/plan", { replace: true });
      }
    } else {
      // If no user in localStorage, force login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex h-screen w-full text-black">
      <Sidebar
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 h-full bg-black overflow-hidden">
        <Header onHamburgerClick={() => setSidebarOpen(true)}>
          {headerChildren}
        </Header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-10 w-full mx-auto max-w-screen-2xl 2xl:max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
