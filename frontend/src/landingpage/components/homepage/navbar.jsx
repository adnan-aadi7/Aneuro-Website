import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  // { label: "Services", href: "/services" },
  // { label: "Blog", href: "/blog" },
  // { label: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-50 w-full py-6 font-manrope text-white bg-black/80 backdrop-blur-md ">
      <div className="flex items-center justify-between px-6 md:px-10">
        <img src="/logo.png" alt="logo" className="w-30 h-12" />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-40 text-[16px] font-medium bg-[#FFFFFF0F] rounded-full px-40 py-3 border border-white/20">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="cursor-pointer hover:text-[#12DCF0] transition"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="/signup"
          className="hidden lg:block text-white font-bold text-[16px] px-5 py-3 rounded-full bg-gradient-to-r from-[#12DCF0] via-[#0A95A3] to-[#0A95A3]"
        >
          Get Started
        </a>

        {/* Mobile Menu Button */}
        <button onClick={toggleSidebar} className="lg:hidden">
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden px-6 mt-4 space-y-4 flex flex-col bg-black">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="py-2 border-b border-white/10 cursor-pointer hover:text-[#12DCF0]"
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/signup"
            className="w-full text-white font-bold text-[16px] px-5 py-3 rounded-full bg-gradient-to-r from-[#12DCF0] via-[#0A95A3] to-[#0A95A3]"
          >
            Get Started
          </a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
