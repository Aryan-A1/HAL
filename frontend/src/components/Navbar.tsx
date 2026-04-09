import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X, Leaf, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/services/authApi";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Govt Schemes", href: "/schemes" },
  { label: "Crop Disease", href: "/crop-disease" },
  { label: "Crop Irrigation", href: "/crop-irrigation" },
  { label: "Catch Up on Crops", href: "/catch-up" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-primary rounded-full px-8 py-3 flex items-center justify-between shadow-[var(--shadow-nav)]">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-primary-foreground font-heading font-bold text-xl">
          <Leaf className="w-5 h-5" />
          HAL
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Auth Actions & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-primary-foreground ml-2 p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
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
            
            {/* Mobile Auth Links */}
            <li className="my-2 border-t border-primary-foreground/20"></li>
            {!isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block text-primary-foreground hover:text-primary hover:bg-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="block text-primary bg-primary-foreground px-4 py-2 mt-1 rounded-lg text-sm font-bold transition-colors shadow-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
               <>
                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-center text-primary-foreground hover:text-primary hover:bg-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile & Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </li>
               </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
