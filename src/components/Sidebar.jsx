import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  PlusCircle,
  History,
  Wallet,
  PieChart,
  ShieldCheck,
  HandCoins
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },
    {
      name: "My Groups",
      path: "/groups",
      icon: Users
    },
    {
      name: "Add Expense",
      path: "/add-expense",
      icon: PlusCircle
    },
    {
      name: "Transactions",
      path: "/history",
      icon: History
    },
    {
      name: "Settlements",
      path: "/settlements",
      icon: HandCoins
    }
  ];

  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-icon">
          <Wallet size={28} />
        </div>

        <div>
          <h2>SplitMate</h2>
          <p>Smart Expense Splitter</p>
        </div>
      </div>

      <p className="menu-title">MAIN MENU</p>

      <nav className="nav-menu">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </nav>

      <div className="sidebar-bottom">

        <div className="sidebar-info">
          <PieChart size={24} />
          <h4>Smart Expense Tracking</h4>
          <p>Split expenses. Stay organized.</p>
        </div>

        <div className="secure-text">
          <ShieldCheck size={16} />
          Secure Cloud Storage
        </div>

      </div>

    </aside>
  );
}