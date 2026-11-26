import { Outlet, useNavigate } from "react-router-dom";
import { CalendarDays, UserCircle, LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const handleLogout = async () => {
    const { error } = await logout();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/login", { replace: true });
  };

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <header className="topbar">

          <div className="date-section">
            <CalendarDays size={20} />
            <span>{today}</span>
          </div>

          <div className="topbar-right">

            <div className="profile">
              <UserCircle size={35} />

              <div>
                <strong>
                  {user?.user_metadata?.full_name || "User"}
                </strong>

                <p>{user?.email}</p>
              </div>
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </header>

        <div className="page-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}