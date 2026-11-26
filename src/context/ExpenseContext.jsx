import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import { useAuth } from "./AuthContext";

import {
  fetchGroups,
  createGroup,
  fetchExpenses,
  createExpense,
  removeExpense
} from "../services/database";

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load data from Supabase
  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");
      setGroups([]);
      setExpenses([]);

      try {
        if (!user) return;

        const [groupData, expenseData] = await Promise.all([
          fetchGroups(),
          fetchExpenses()
        ]);

        if (active) {
          setGroups(groupData);
          setExpenses(expenseData);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [user?.id]);

  // Add Group
  const addGroup = async (group) => {
    try {
      if (!user) throw new Error("Please login first.");

      const newGroup = await createGroup(group, user.id);

      setGroups((prev) => [newGroup, ...prev]);

      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  // Add Expense
  const addExpense = async (expense) => {
    try {
      await createExpense(expense);

      const updatedExpenses = await fetchExpenses();

      setExpenses(updatedExpenses);

      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await removeExpense(id);

      setExpenses((prev) =>
        prev.filter((expense) => expense.id !== id)
      );

      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        groups,
        loading,
        error,
        addExpense,
        deleteExpense,
        addGroup
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}