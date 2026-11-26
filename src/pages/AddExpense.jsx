import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calculator, PlusCircle } from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";

export default function AddExpense() {
  const { groups, addExpense, loading, error } = useExpenses();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [groupId, setGroupId] = useState("");
  const [paidBy, setPaidBy] = useState("You");
  const [saving, setSaving] = useState(false);

  const group = groups.find((g) => g.id === groupId);

  const members = group?.members || ["You"];

  const share = Number(amount || 0) / members.length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!group || !title.trim() || Number(amount) <= 0) {
      alert("Please enter valid expense details.");
      return;
    }

    setSaving(true);

    try {
      const success = await addExpense({
        title: title.trim(),
        amount: Number(amount),
        category,
        group: group.name,
        groupId,
        paidBy,
        share: Number(share.toFixed(2)),
        members,
        date: new Date().toISOString()
      });

      if (success) {
        alert("Expense added successfully!");
        navigate("/");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">TRACK YOUR SPENDING</p>
          <h1>Add Expense</h1>
          <p>Record and split expenses with your group.</p>
        </div>
      </div>

      {loading ? (
        <div className="panel">Loading groups...</div>
      ) : error ? (
        <div className="panel">{error}</div>
      ) : groups.length === 0 ? (
        <div className="panel empty-state">
          <p>Create a group before adding expenses.</p>
          <Link to="/groups" className="primary-btn">
            Create Group
          </Link>
        </div>
      ) : (
        <div className="panel form-panel">
          <form onSubmit={handleSubmit}>

            <label>Expense Title</label>

            <input
              type="text"
              placeholder="e.g. Restaurant Bill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label>Amount (₹)</label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <label>Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {[
                "Food",
                "Travel",
                "Rent",
                "Shopping",
                "Entertainment",
                "Other"
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label>Select Group</label>

            <select
              value={groupId}
              onChange={(e) => {
                setGroupId(e.target.value);
                setPaidBy("You");
              }}
              required
            >
              <option value="">Choose a group</option>

              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            <label>Paid By</label>

            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              {members.map((member) => (
                <option key={member}>{member}</option>
              ))}
            </select>

            {group && Number(amount) > 0 && (
              <div className="split-preview">
                <Calculator size={24} />

                <div>
                  <h3>Split Preview</h3>
                  <p>Total Members: {members.length}</p>
                  <p>
                    Approx. amount per person: ₹{share.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            <button
              className="primary-btn"
              type="submit"
              disabled={saving}
            >
              <PlusCircle size={18} />
              {saving ? "Saving Expense..." : "Add Expense"}
            </button>

          </form>
        </div>
      )}
    </div>
  );
}