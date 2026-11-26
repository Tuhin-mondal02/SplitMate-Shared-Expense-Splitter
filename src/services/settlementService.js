import { supabase } from "./supabase";

// Fetch all settlements
export async function fetchSettlements() {
  const { data, error } = await supabase
    .from("settlements")
    .select("*, groups(name)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

// Create settlement
export async function createSettlement(settlement) {
  const { data, error } = await supabase
    .from("settlements")
    .insert({
      group_id: settlement.groupId,
      paid_by: settlement.paidBy,
      paid_to: settlement.paidTo,
      amount: settlement.amount,
      status: "Pending"
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Mark payment as settled
export async function markAsSettled(id) {
  const { error } = await supabase
    .from("settlements")
    .update({ status: "Settled" })
    .eq("id", id);

  if (error) throw error;
}

// Delete settlement
export async function deleteSettlement(id) {
  const { error } = await supabase
    .from("settlements")
    .delete()
    .eq("id", id);

  if (error) throw error;
}