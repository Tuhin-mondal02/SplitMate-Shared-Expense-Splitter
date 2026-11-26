import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Receipt,
  Users
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import BalanceCard from "../components/BalanceCard";
import { useExpenses } from "../context/ExpenseContext";
import { fetchSettlements } from "../services/settlementService";
import { calculateBalances } from "../utils/balanceCalculator";

export default function Dashboard() {
  const { expenses, groups, loading, error } = useExpenses();

  const [settlements, setSettlements] = useState([]);
  const [settlementLoading, setSettlementLoading] = useState(true);
  const [settlementError, setSettlementError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettlements() {
      try {
        const data = await fetchSettlements();

        if (active) setSettlements(data);
      } catch (err) {
        if (active) setSettlementError(err.message);
      } finally {
        if (active) setSettlementLoading(false);
      }
    }

    loadSettlements();

    return () => {
      active = false;
    };
  }, []);

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const { youOwe, youAreOwed } = calculateBalances(
    expenses,
    settlements
  );

  const categories = [
    "Food",
    "Travel",
    "Rent",
    "Shopping",
    "Entertainment",
    "Other"
  ];

  const chartData = categories.map((category) => ({
    name: category,
    amount: expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
  }));

  if (loading || settlementLoading) {
    return <div className="panel">Loading dashboard...</div>;
  }

  if (error || settlementError) {
    return (
      <div className="panel" style={{ color: "red" }}>
        {error || settlementError}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">FINANCIAL OVERVIEW</p>
          <h1>Dashboard</h1>
          <p>Manage your shared expenses in one place.</p>
        </div>

        <Link to="/add-expense" className="primary-btn">
          <Plus size={20} />
          Add Expense
        </Link>
      </div>

      <div className="welcome-banner">
        <h2>Welcome to SplitMate!</h2>
        <p>
          Split expenses, track payments and stay organized.
        </p>
      </div>

      <div className="cards">
        <BalanceCard
          title="Total Expenses"
          amount={total}
          color="#3b82f6"
          icon={Wallet}
          description="All recorded expenses"
        />

        <BalanceCard
          title="You Owe"
          amount={youOwe}
          color="#ef4444"
          icon={ArrowUpRight}
          description="Outstanding payments"
        />

        <BalanceCard
          title="You Are Owed"
          amount={youAreOwed}
          color="#10b981"
          icon={ArrowDownLeft}
          description="Remaining amount to receive"
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h2>Expense Overview</h2>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="amount"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h2>Group Overview</h2>

          <div className="group-summary">
            <Users size={40} color="#10b981" />
            <h1>{groups.length}</h1>
            <p>Total Groups</p>

            <Link to="/groups" className="primary-btn">
              View Groups
            </Link>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: "25px" }}>
        <h2>Recent Expenses</h2>

        {expenses.length === 0 ? (
          <div className="empty-state">
            <Receipt size={40} />
            <p>No expenses recorded yet.</p>
          </div>
        ) : (
          expenses.slice(0, 5).map((expense) => (
            <div className="expense-row" key={expense.id}>
              <div className="expense-icon">
                <Receipt size={22} />
              </div>

              <div className="expense-details">
                <h3>{expense.title}</h3>
                <p>
                  {expense.category} • {expense.group}
                </p>
                <p>Paid by: {expense.paidBy}</p>
              </div>

              <strong>
                ₹{expense.amount.toLocaleString("en-IN")}
              </strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}