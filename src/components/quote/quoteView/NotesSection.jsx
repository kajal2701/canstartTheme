import React from "react";
import Card from "@/components/ui/Card";
import { SectionHeader } from "../../../utils/helperFunctions";

const NotesSection = ({ quote }) => {
  return (
    <Card>
      <SectionHeader icon="ph:note-pencil" title="Notes" />
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Customer Notes
          </label>
          <div className="min-h-[64px] p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
            {quote.notes || (
              <span className="italic text-slate-300 dark:text-slate-600">
                No notes added
              </span>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Admin Notes
          </label>
          <div className="min-h-[64px] p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
            {quote.adminnotes || (
              <span className="italic text-slate-300 dark:text-slate-600">
                No notes added
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotesSection;
