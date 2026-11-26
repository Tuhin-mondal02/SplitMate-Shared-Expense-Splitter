import { useState } from "react";
import { Search, Trash2, Receipt } from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";

export default function History() {
  const { expenses, deleteExpense, loading, error } = useExpenses();

  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  const filteredExpenses = expenses.filter((expense) =>
    `${expense.title} ${expense.category} ${expense.group} ${expense.paidBy}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense permanently?")) {
      return;
    }

    setDeleting(id);

    try {
      const success = await deleteExpense(id);

      if (success) {
        alert("Expense deleted successfully!");
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">EXPENSE RECORDS</p>
          <h1>Transaction History</h1>
          <p>View and manage all your expenses.</p>
        </div>
      </div>

      <div className="panel">

        <div className="search-box">
          <Search size={20} />

          <input
            className="search-input"
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p>Loading transactions...</p>}

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        {!loading && !error && filteredExpenses.length === 0 && (
          <div className="empty-state">
            <Receipt size={40} />
            <p>No transactions found.</p>
          </div>
        )}

        {filteredExpenses.map((expense) => (
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

              <p>
                {new Date(expense.date).toLocaleDateString("en-IN")}
              </p>
            </div>

            <div className="transaction-amount">
              <strong>
                ₹{expense.amount.toLocaleString("en-IN")}
              </strong>

              <p>Your share: ₹{expense.share.toFixed(2)}</p>
            </div>

            <button
              className="delete-btn"
              disabled={deleting !== null}
              onClick={() => handleDelete(expense.id)}
              title="Delete Expense"
            >
              <Trash2 size={18} />
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}