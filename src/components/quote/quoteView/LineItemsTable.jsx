import React from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import { RichDescription, SectionHeader } from "../../../utils/helperFunctions";
import QuoteButton from "../shared/QuoteButton";
import { BUTTON_ICONS } from "../shared/constants";

const LineItemsTable = ({ formattedItems }) => {
  return (
    <Card>
      <SectionHeader icon="ph:list-bullets" title="Line Items" />

      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-10">
                #
              </th>
              <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Description
              </th>
              <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-24">
                Images
              </th>
              <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-24">
                Qty
              </th>
              <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-24">
                Unit Cost
              </th>
              <th className="py-3 px-5 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-28">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {formattedItems.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors"
              >
                <td className="py-4 px-5">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {item.id}
                  </span>
                </td>
                <td className="py-4 px-3 text-slate-700 dark:text-slate-300 leading-6 max-w-sm pr-6">
                  <RichDescription text={item.description} />
                </td>
                <td className="py-4 px-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.images.map((_, i) => (
                      <button
                        key={i}
                        className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:scale-110 transition-all"
                        title="View image"
                      >
                        <Icon icon={BUTTON_ICONS.eye} className="text-sm" />
                      </button>
                    ))}
                    {item.images.length === 0 && (
                      <span className="text-xs text-slate-300 dark:text-slate-600">
                        —
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-3 text-right">
                  <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {item.quantity}
                  </span>
                </td>
                <td className="py-4 px-3 text-right text-sm text-slate-600 dark:text-slate-400">
                  ${item.unitCost}
                </td>
                <td className="py-4 px-5 text-right">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    ${item.total.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
        <QuoteButton icon={BUTTON_ICONS.add} variant="outline">
          Add Extra Work
        </QuoteButton>
        <QuoteButton icon={BUTTON_ICONS.submit} variant="outlineOrange">
          Submit
        </QuoteButton>
      </div>
    </Card>
  );
};

export default LineItemsTable;
