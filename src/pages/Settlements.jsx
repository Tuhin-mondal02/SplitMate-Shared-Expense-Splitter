import { useState, useEffect } from "react";
import { Wallet, CheckCircle, Trash2 } from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";

import {
  fetchSettlements,
  createSettlement,
  markAsSettled,
  deleteSettlement
} from "../services/settlementService";

export default function Settlements() {
  const { groups } = useExpenses();

  const [settlements, setSettlements] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [paidTo, setPaidTo] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const group = groups.find((g) => g.id === groupId);
  const members = group?.members || [];

  async function loadSettlements() {
    try {
      setSettlements(await fetchSettlements());
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadSettlements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !groupId ||
      !members.includes(paidBy) ||
      !members.includes(paidTo) ||
      paidBy === paidTo ||
      Number(amount) <= 0
    ) {
      alert("Please enter valid payment details.");
      return;
    }

    setBusy(true);

    try {
      await createSettlement({
        groupId,
        paidBy,
        paidTo,
        amount: Number(amount)
      });

      setAmount("");
      await loadSettlements();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSettle = async (id) => {
    setBusy(true);

    try {
      await markAsSettled(id);
      await loadSettlements();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this settlement?")) return;

    setBusy(true);

    try {
      await deleteSettlement(id);
      await loadSettlements();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const pending = settlements
    .filter((s) => s.status === "Pending")
    .reduce((sum, s) => sum + Number(s.amount), 0);

  const settled = settlements
    .filter((s) => s.status === "Settled")
    .reduce((sum, s) => sum + Number(s.amount), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">MANAGE PAYMENTS</p>
          <h1>Payment Settlements</h1>
          <p>Track pending and completed payments.</p>
        </div>
      </div>

      <div className="settlement-summary">
        <div className="panel">
          <p>Pending Payments</p>
          <h1 style={{ color: "#f59e0b" }}>
            ₹{pending.toFixed(2)}
          </h1>
        </div>

        <div className="panel">
          <p>Settled Payments</p>
          <h1 style={{ color: "#10b981" }}>
            ₹{settled.toFixed(2)}
          </h1>
        </div>
      </div>

      <div className="panel form-panel">
        <h2>Create Settlement</h2>

        <form onSubmit={handleSubmit}>
          <label>Select Group</label>

          <select
            value={groupId}
            onChange={(e) => {
              setGroupId(e.target.value);
              setPaidBy("");
              setPaidTo("");
            }}
            required
          >
            <option value="">Choose Group</option>

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
            required
          >
            <option value="">Select Member</option>

            {members.map((member) => (
              <option key={member}>{member}</option>
            ))}
          </select>

          <label>Paid To</label>

          <select
            value={paidTo}
            onChange={(e) => setPaidTo(e.target.value)}
            required
          >
            <option value="">Select Member</option>

            {members
              .filter((member) => member !== paidBy)
              .map((member) => (
                <option key={member}>{member}</option>
              ))}
          </select>

          <label>Amount (₹)</label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            placeholder="Enter payment amount"
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button
            className="primary-btn"
            type="submit"
            disabled={busy}
          >
            <Wallet size={18} />
            Create Settlement
          </button>
        </form>
      </div>

      <div className="panel" style={{ marginTop: "25px" }}>
        <h2>Settlement History</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!error && settlements.length === 0 && (
          <div className="empty-state">
            <Wallet size={40} />
            <p>No settlements found.</p>
          </div>
        )}

        {settlements.map((s) => (
          <div className="expense-row" key={s.id}>

            <div className="expense-icon">
              <Wallet size={22} />
            </div>

            <div className="expense-details">
              <h3>{s.paid_by} → {s.paid_to}</h3>
              <p>{s.groups?.name}</p>

              <span
                className={
                  s.status === "Settled"
                    ? "status-settled"
                    : "status-pending"
                }
              >
                {s.status}
              </span>
            </div>

            <strong>₹{Number(s.amount).toFixed(2)}</strong>

            {s.status === "Pending" && (
              <button
                className="settle-btn"
                disabled={busy}
                onClick={() => handleSettle(s.id)}
                title="Mark as Settled"
              >
                <CheckCircle size={18} />
                Settle
              </button>
            )}

            <button
              className="delete-btn"
              disabled={busy}
              onClick={() => handleDelete(s.id)}
              title="Delete Settlement"
            >
              <Trash2 size={18} />
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}