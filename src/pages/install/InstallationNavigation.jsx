import React from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { PROCESS_STEPS } from "@/utils/constants";

const InstallationNavigation = ({
  currentStep,
  setCurrentStep,
  isCompleted,
  isSaving,
  handleSaveStep,
  isStepValid,
  isCurrentStepSaved,
  savedSteps,
}) => {
  const isOptionalStep = currentStep === 3; // Controller Box is optional

  if (isCompleted) return null;

  return (
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
      <Button
        text="Previous"
        icon="ph:arrow-left"
        className="btn-outline-secondary"
        disabled={currentStep === 1}
        onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
      />

      <div className="hidden sm:flex items-center gap-2">
        {PROCESS_STEPS.map((step) => (
          <div
            key={step.id}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${step.id === currentStep
              ? "bg-indigo-500"
              : savedSteps[step.id]
                ? "bg-green-400"
                : step.id < currentStep
                  ? "bg-indigo-300"
                  : "bg-gray-200 dark:bg-gray-600"
              }`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        {/* Save Button — visible on steps 1–6 */}
        {currentStep < 7 && (
          <button
            type="button"
            onClick={handleSaveStep}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Icon icon="ph:circle-notch" className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icon icon="ph:floppy-disk" />
                Save
              </>
            )}
          </button>
        )}

        {/* Next Button */}
        {currentStep < 7 && (
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isStepValid(currentStep) || (!isCurrentStepSaved && !isOptionalStep)}
            onClick={() => setCurrentStep((s) => Math.min(7, s + 1))}
          >
            <span>Next</span>
            <Icon icon="ph:arrow-right" />
          </button>
        )}
        {currentStep === 7 && <div />}
      </div>
    </div>
  );
};

export default InstallationNavigation;
