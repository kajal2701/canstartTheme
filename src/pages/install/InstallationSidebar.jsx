import React from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import { PROCESS_STEPS } from "@/utils/constants";

const InstallationSidebar = ({ currentStep, setCurrentStep, isCompleted, savedSteps }) => {
  return (
    <Card className="!shadow-sm border border-gray-100 dark:border-gray-700 static lg:sticky lg:top-24">
      <div className="space-y-1">
        {PROCESS_STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isPast = currentStep > step.id;
          const isCompletedStep = isCompleted;
          const isSaved = savedSteps[step.id] === true;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${isActive
                ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700"
                : isPast || isCompletedStep
                  ? "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50 opacity-60"
                }`}
            >
              {/* Step number/check */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${isCompletedStep || isSaved
                  ? "bg-green-500 text-white"
                  : isActive
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  }`}
              >
                {isCompletedStep || isSaved ? (
                  <Icon icon="ph:check-bold" className="text-sm" />
                ) : (
                  step.id
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${isActive
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300"
                    }`}
                >
                  {step.label}
                </p>
              </div>

              <Icon
                icon={step.icon}
                className={`text-lg flex-shrink-0 ${isActive ? "text-indigo-500" : "text-gray-400"
                  }`}
              />
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default InstallationSidebar;
