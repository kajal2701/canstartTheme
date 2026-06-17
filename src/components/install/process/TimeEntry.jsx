import React, { useCallback } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StepHeader from "./StepHeader";
import { blockInvalidNumberKeys } from "@/utils/helperFunctions";

const TimeEntry = ({ data, onChange }) => {
  const expenses = data?.expenses || [];

  const updateField = useCallback((field, value) => {
    onChange({ ...data, [field]: value });
  }, [data, onChange]);

  const addExpense = useCallback(() => {
    updateField("expenses", [
      ...expenses,
      { id: Date.now(), description: "", amount: "" },
    ]);
  }, [expenses, updateField]);

  const updateExpense = useCallback((index, field, value) => {
    const updated = [...expenses];
    updated[index] = { ...updated[index], [field]: value };
    updateField("expenses", updated);
  }, [expenses, updateField]);

  const removeExpense = useCallback((index) => {
    const updated = [...expenses];
    updated.splice(index, 1);
    updateField("expenses", updated);
  }, [expenses, updateField]);

  const totalTime = data?.totalTime || { hours: 0, minutes: 0 };

  // Total expenses
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0), 0
  );

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <StepHeader
        icon="ph:clock"
        iconColorClass="text-blue-500"
        title="Time Entry"
        description="Record the time spent on this installation and any additional expenses."
        colorClass="from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800"
      />

      {/* ── Time Inputs ── */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Icon icon="ph:timer" className="text-blue-500" />
            <span>Total Time Spent</span>
          </div>
        }
        className="!shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={totalTime.hours}
              onChange={(e) =>
                updateField("totalTime", { ...totalTime, hours: parseInt(e.target.value) || 0 })
              }
              onKeyDown={blockInvalidNumberKeys}
              onWheel={(e) => e.target.blur()}
              className="w-20 text-sm text-center px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">hrs</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="59"
              value={totalTime.minutes}
              onChange={(e) =>
                updateField("totalTime", { ...totalTime, minutes: parseInt(e.target.value) || 0 })
              }
              onKeyDown={blockInvalidNumberKeys}
              onWheel={(e) => e.target.blur()}
              className="w-20 text-sm text-center px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">min</span>
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
                <div className="sm:col-span-6">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block">Description</label>
                  <input
                    type="text"
                    value={exp.description}
                    onChange={(e) => updateExpense(idx, "description", e.target.value)}
                    placeholder="Expense description"
                    className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-4">
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
                <div className="sm:col-span-2 flex justify-center">
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
