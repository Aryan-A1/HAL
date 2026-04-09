import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Leaf } from "lucide-react";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Crop Disease", href: "/crop-disease" },
  { label: "Crop Irrigation", href: "/crop-irrigation" },
  { label: "Catch Up on Crops", href: "/#catch-up-on-crops" },
  { label: "Dashboard", href: "/#dashboard" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="bg-primary rounded-full px-6 py-3 flex items-center justify-between shadow-[var(--shadow-nav)]">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-primary-foreground font-heading font-bold text-xl">
          <Leaf className="w-5 h-5" />
          HAL
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 bg-primary rounded-2xl p-4 shadow-[var(--shadow-elevated)]">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="block text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
