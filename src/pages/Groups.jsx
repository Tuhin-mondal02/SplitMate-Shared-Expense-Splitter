import { useState } from "react";
import { Users, Plus } from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";

export default function Groups() {
  const { groups, addGroup, loading, error } = useExpenses();

  const [name, setName] = useState("");
  const [members, setMembers] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const memberList = [
      ...new Set(
        members
          .split(",")
          .map((member) => member.trim())
          .filter(
            (member) =>
              member && member.toLowerCase() !== "you"
          )
      )
    ];

    if (!name.trim() || memberList.length === 0) {
      alert("Enter group name and at least one member.");
      return;
    }

    setSaving(true);

    try {
      const success = await addGroup({
        name: name.trim(),
        members: ["You", ...memberList]
      });

      if (success) {
        setName("");
        setMembers("");
        alert("Group created successfully!");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">MANAGE YOUR GROUPS</p>
          <h1>My Groups</h1>
          <p>Create groups and split expenses with friends.</p>
        </div>
      </div>

      <div className="panel form-panel">
        <h2>Create New Group</h2>

        <form onSubmit={handleSubmit}>
          <label>Group Name</label>

          <input
            type="text"
            placeholder="e.g. College Friends"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Group Members</label>

          <input
            type="text"
            placeholder="e.g. Rahul, Amit, Rohit"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            required
          />

          <p style={{ color: "#64748b", fontSize: "13px" }}>
            Separate member names using commas.
          </p>

          <button
            className="primary-btn"
            type="submit"
            disabled={saving || loading}
          >
            <Plus size={18} />
            {saving ? "Creating Group..." : "Create Group"}
          </button>
        </form>
      </div>

      <h2 style={{ margin: "25px 0 15px" }}>
        Your Groups
      </h2>

      {loading && <p>Loading groups...</p>}

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {!loading && !error && groups.length === 0 && (
        <div className="panel empty-state">
          <Users size={40} />
          <p>No groups created yet.</p>
        </div>
      )}

      <div className="group-grid">
        {groups.map((group) => (
          <div className="group-card" key={group.id}>

            <div className="expense-icon">
              <Users size={24} />
            </div>

            <h3>{group.name}</h3>

            <p>{group.members.length} Members</p>

            <div className="member-list">
              {group.members.map((member) => (
                <span key={member}>{member}</span>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}