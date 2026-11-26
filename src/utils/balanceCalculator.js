export function calculateBalances(expenses, settlements) {
  const balances = new Map();

  function updateBalance(groupId, member, amount) {
    const key = JSON.stringify([groupId, member]);

    balances.set(
      key,
      (balances.get(key) || 0) + amount
    );
  }

  // Calculate expense balances
  expenses.forEach((expense) => {
    if (expense.paidBy === "You") {
      expense.members.forEach((member) => {
        if (member !== "You") {
          updateBalance(
            expense.groupId,
            member,
            Math.round(expense.share * 100)
          );
        }
      });
    } else {
      updateBalance(
        expense.groupId,
        expense.paidBy,
        -Math.round(expense.share * 100)
      );
    }
  });

  // Adjust completed settlements
  settlements.forEach((settlement) => {
    if (settlement.status !== "Settled") return;

    const amount = Math.round(
      Number(settlement.amount) * 100
    );

    if (settlement.paid_to === "You") {
      updateBalance(
        settlement.group_id,
        settlement.paid_by,
        -amount
      );
    }

    if (settlement.paid_by === "You") {
      updateBalance(
        settlement.group_id,
        settlement.paid_to,
        amount
      );
    }
  });

  let youOwe = 0;
  let youAreOwed = 0;

  balances.forEach((balance) => {
    if (balance > 0) {
      youAreOwed += balance;
    } else {
      youOwe += Math.abs(balance);
    }
  });

  return {
    youOwe: youOwe / 100,
    youAreOwed: youAreOwed / 100
  };
}