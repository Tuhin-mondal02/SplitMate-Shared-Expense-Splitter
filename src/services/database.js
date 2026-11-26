import { supabase } from "./supabase";

// Fetch Groups
export async function fetchGroups() {
  const { data, error } = await supabase
    .from("groups")
    .select("*, group_members(name)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((group) => ({
    id: group.id,
    name: group.name,
    members: group.group_members.map((member) => member.name)
  }));
}

// Create Group
export async function createGroup(group, userId) {
  const { data, error } = await supabase
    .from("groups")
    .insert({
      name: group.name,
      user_id: userId
    })
    .select()
    .single();

  if (error) throw error;

  const members = group.members.map((name) => ({
    group_id: data.id,
    name
  }));

  const { error: memberError } = await supabase
    .from("group_members")
    .insert(members);

  if (memberError) {
    await supabase.from("groups").delete().eq("id", data.id);
    throw memberError;
  }

  return {
    id: data.id,
    name: data.name,
    members: group.members
  };
}

// Fetch Expenses
export async function fetchExpenses() {
  const { data, error } = await supabase
    .from("expenses")
    .select("*, groups(name, group_members(name))")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((expense) => ({
    id: expense.id,
    title: expense.title,
    amount: Number(expense.amount),
    category: expense.category,
    groupId: expense.group_id,
    group: expense.groups?.name,
    paidBy: expense.paid_by,
    share: Number(expense.share),
    members: expense.groups?.group_members.map(
      (member) => member.name
    ) || [],
    date: expense.created_at
  }));
}

// Create Expense
export async function createExpense(expense) {
  const { error } = await supabase
    .from("expenses")
    .insert({
      group_id: expense.groupId,
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      paid_by: expense.paidBy,
      share: expense.share
    });

  if (error) throw error;
}

// Delete Expense
export async function removeExpense(id) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) throw error;
}