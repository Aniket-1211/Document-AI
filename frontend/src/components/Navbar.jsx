import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const navLinkClassName = ({ isActive }) =>
  [
    "rounded-full px-4 py-2 text-sm font-semibold !text-white transition duration-200",
    isActive
      ? "bg-yellow-400/40"
      : "hover:bg-white/10",
  ].join(" ");

function Navbar() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("docAIUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("docAIUser");
      setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const apiResponse = await fetch(`${apiBaseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const response = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(response.message || "Unable to log out.");
      }

      localStorage.removeItem("docAIUser");
      window.dispatchEvent(new Event("auth-change"));
      toast.success(response.message || "Logout successful.");
      navigate("/signin");
    } catch (error) {
      toast.error(error.message || "Unable to log out.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-800/80 bg-gradient-to-r from-emerald-950 via-green-900 to-teal-900 shadow-sm backdrop-blur-xl">
      <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-bold text-white">
            DA
          </div>
          <div>
            <p className="font-serif text-xl text-white">Doc AI</p>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">
              Document intelligence
            </p>
          </div>
        </NavLink>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {currentUser ? (
            <>
              <nav className="flex items-center gap-1 rounded-full border border-emerald-800/80 bg-emerald-950/50 p-1 shadow-sm">
                <NavLink to="/upload" className={navLinkClassName}>
                  Upload
                </NavLink>
                <NavLink to="/documents" className={navLinkClassName}>
                  Documents
                </NavLink>
                <NavLink to="/chat" className={navLinkClassName}>
                  Chat
                </NavLink>
              </nav>
              <span className="rounded-full bg-emerald-900/70 px-3 py-2 text-sm font-medium text-emerald-50">
                {currentUser.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="ui-btn-danger"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <nav className="flex items-center gap-2">
              <NavLink to="/signin" className={navLinkClassName}>
                Sign in
              </NavLink>
              <NavLink to="/signup" className="ui-btn-primary">
                Sign up
              </NavLink>
            </nav>
          )}
        </div>

        <button
          type="button"
          className="ml-auto md:hidden inline-flex items-center gap-2 rounded-full border border-emerald-700/80 bg-emerald-900/70 px-4 py-2 text-sm font-semibold text-emerald-50 shadow-sm transition hover:bg-emerald-800/80"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className="relative block h-3.5 w-4">
            <span className="absolute left-0 top-0 h-0.5 w-4 rounded-full bg-emerald-50" />
            <span className="absolute left-0 top-1.5 h-0.5 w-4 rounded-full bg-emerald-50" />
            <span className="absolute left-0 top-3 h-0.5 w-4 rounded-full bg-emerald-50" />
          </span>
        </button>
      </div>

      <div className={`${isMenuOpen ? "block" : "hidden"} border-t border-emerald-800 md:hidden`}>
        <div className="flex w-full flex-col gap-2 px-4 py-4 sm:px-6 lg:px-10">
          {currentUser ? (
            <>
              <NavLink to="/upload" className={navLinkClassName} onClick={() => setIsMenuOpen(false)}>
                Upload
              </NavLink>
              <NavLink to="/documents" className={navLinkClassName} onClick={() => setIsMenuOpen(false)}>
                Documents
              </NavLink>
              <NavLink to="/chat" className={navLinkClassName} onClick={() => setIsMenuOpen(false)}>
                Chat
              </NavLink>
              <div className="mt-2 rounded-2xl bg-emerald-900/70 px-4 py-3 text-sm font-medium text-emerald-50">
                Signed in as {currentUser.name}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="ui-btn-danger"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={navLinkClassName} onClick={() => setIsMenuOpen(false)}>
                Sign in
              </NavLink>
              <NavLink to="/signup" className="ui-btn-primary w-fit" onClick={() => setIsMenuOpen(false)}>
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
