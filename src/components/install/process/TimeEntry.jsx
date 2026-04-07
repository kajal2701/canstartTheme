import React from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const TimeEntry = ({ data, onChange }) => {
  const expenses = data?.expenses || [];

  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const addExpense = () => {
    updateField("expenses", [
      ...expenses,
      { id: Date.now(), description: "", amount: "" },
    ]);
  };

  const updateExpense = (index, field, value) => {
    const updated = [...expenses];
    updated[index] = { ...updated[index], [field]: value };
    updateField("expenses", updated);
  };

  const removeExpense = (index) => {
    const updated = [...expenses];
    updated.splice(index, 1);
    updateField("expenses", updated);
  };

  // Calculate duration
  const calcDuration = () => {
    if (!data?.startTime || !data?.endTime) return null;
    const [sh, sm] = data.startTime.split(":").map(Number);
    const [eh, em] = data.endTime.split(":").map(Number);
    let diffMin = (eh * 60 + em) - (sh * 60 + sm);
    if (diffMin < 0) diffMin += 24 * 60; // overnight
    const hrs = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    return { hrs, mins, total: diffMin };
  };

  const duration = calcDuration();

  // Total expenses
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0), 0
  );

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <Icon icon="ph:clock" className="text-blue-500 text-xl" />
          Time Entry
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Record the time spent on this installation and any additional expenses.
        </p>
      </div>

      {/* ── Time Inputs ── */}
      <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Start */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Icon icon="ph:play-circle" className="text-green-500" />
              Start Time
            </label>
            <input
              type="time"
              value={data?.startTime || ""}
              onChange={(e) => updateField("startTime", e.target.value)}
              className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Icon icon="ph:stop-circle" className="text-red-500" />
              End Time
            </label>
            <input
              type="time"
              value={data?.endTime || ""}
              onChange={(e) => updateField("endTime", e.target.value)}
              className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Icon icon="ph:timer" className="text-blue-500" />
              Duration
            </label>
            <div className="w-full text-sm px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium">
              {duration
                ? `${duration.hrs}h ${duration.mins}m`
                : "—"}
            </div>
          </div>
        </div>
      </Card>

      {/* ── Expenses ── */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Icon icon="ph:receipt" className="text-amber-500" />
            <span>Other Expenses</span>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
              If applicable
            </span>
          </div>
        }
        headerslot={
          <Button
            text="Add Expense"
            icon="ph:plus"
            className="btn-outline-primary btn-sm"
            onClick={addExpense}
          />
        }
        className="!shadow-sm border border-gray-100 dark:border-gray-700"
      >
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <Icon icon="ph:receipt" className="text-3xl mb-2" />
            <p className="text-sm">No expenses added. Click "Add Expense" if applicable.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-700 px-3">
              <div className="col-span-6">Description</div>
              <div className="col-span-4">Amount ($)</div>
              <div className="col-span-2"></div>
            </div>

            {expenses.map((exp, idx) => (
              <div
                key={exp.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-gray-700/30 rounded-lg px-3 py-2"
              >
                <div className="col-span-6">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block">Description</label>
                  <input
                    type="text"
                    value={exp.description}
                    onChange={(e) => updateExpense(idx, "description", e.target.value)}
                    placeholder="Expense description"
                    className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-4">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block">Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={exp.amount}
                    onChange={(e) => updateExpense(idx, "amount", e.target.value)}
                    placeholder="0.00"
                    className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeExpense(idx)}
                    className="w-7 h-7 rounded-md bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    <Icon icon="ph:trash" className="text-sm" />
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses:</span>
                <span className="text-lg font-bold text-green-600">${totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TimeEntry;
