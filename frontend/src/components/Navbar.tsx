import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X, Leaf, User as UserIcon, Bell, Globe } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/services/authApi";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/useNotificationStore";
import NotificationPanel from "@/components/NotificationPanel";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageStore } from "@/store/useLanguageStore";

const getNavItems = (t: any) => [
  { label: t.navbar.home, href: "/#home" },
  { label: t.navbar.schemes, href: "/schemes" },
  { label: t.navbar.cropDisease, href: "/crop-disease" },
  { label: t.navbar.cropIrrigation, href: "/crop-irrigation" },
  { label: t.navbar.catchUp, href: "/catch-up" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount());
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const navItems = getNavItems(t);

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
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-primary-foreground hover:bg-primary-foreground/10 text-sm font-medium transition-colors"
          >
            <Globe className="w-4 h-4" />
            {t.navbar.language}
          </button>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    {t.navbar.login}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    {t.navbar.signUp}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* 🔔 Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen((o) => !o)}
                    className="relative p-2 rounded-full text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
                </div>

                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                    <UserIcon className="w-4 h-4 mr-2" />
                    {t.navbar.profile}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={handleLogout}>
                  {t.navbar.logout}
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
            
            {/* Mobile Language Toggle */}
            <li className="my-1">
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileOpen(false);
                }}
                className="w-full flex items-center justify-between text-primary-foreground hover:text-primary hover:bg-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Language
                </div>
                <span className="font-bold">{t.navbar.language}</span>
              </button>
            </li>

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
                    {t.navbar.login}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="block text-primary bg-primary-foreground px-4 py-2 mt-1 rounded-lg text-sm font-bold transition-colors shadow-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t.navbar.signUp}
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
                    {t.navbar.profile}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => { setMobileOpen(false); setNotifOpen((o) => !o); }}
                    className="w-full flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {t.navbar.notifications}
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {t.navbar.logout}
                  </button>
                </li>
               </>
            )}
          </ul>
        </div>
      )}

      {/* Mobile Notification Panel — rendered outside pill for visibility */}
      {notifOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full mt-2 px-3 z-50">
          <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
