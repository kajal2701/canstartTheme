import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { DUMMY_CALENDAR_JOBS, PROCESS_STEPS, getDefaultProcessState } from "@/mocks/installMocks";

import PrepStage from "@/components/install/process/PrepStage";
import OnTheWay from "@/components/install/process/OnTheWay";
import ControllerBoxLocation from "@/components/install/process/ControllerBoxLocation";
import PostInstallationChecklist from "@/components/install/process/PostInstallationChecklist";
import PostInstallationImages from "@/components/install/process/PostInstallationImages";
import SuppliesDropOff from "@/components/install/process/SuppliesDropOff";
import TimeEntry from "@/components/install/process/TimeEntry";
import CompletionStep from "@/components/install/process/CompletionStep";

const InstallationProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the job from dummy data
  const job = useMemo(
    () => DUMMY_CALENDAR_JOBS.find((j) => String(j.quote_id) === String(id)),
    [id]
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [processState, setProcessState] = useState(() => getDefaultProcessState(job));

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Icon icon="ph:warning-circle" className="text-5xl text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Installation Not Found
        </h2>
        <p className="text-sm text-gray-500 mb-4">Quote ID: {id}</p>
        <Button text="Back to Installs" icon="ph:arrow-left" className="btn-primary" onClick={() => navigate("/install")} />
      </div>
    );
  }

  // ── Update helpers ──
  const updateStep = (key, value) => {
    setProcessState((prev) => ({ ...prev, [key]: value }));
  };

  // ── Step mapping ──
  const STEP_KEYS = ["prep", "onTheWay", "controllerBox", "postInstall", "dropOff", "timeEntry", "completed"];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PrepStage data={processState.prep} onChange={(v) => updateStep("prep", v)} job={job} />;
      case 2:
        return <OnTheWay data={processState.onTheWay} onChange={(v) => updateStep("onTheWay", v)} job={job} />;
      case 3:
        return <ControllerBoxLocation data={processState.controllerBox} onChange={(v) => updateStep("controllerBox", v)} job={job} />;
      case 4:
        return (
          <div className="space-y-6">
            <PostInstallationChecklist data={processState.postInstall} onChange={(v) => updateStep("postInstall", v)} />
            <PostInstallationImages data={processState.postInstall} onChange={(v) => updateStep("postInstall", v)} />
          </div>
        );
      case 5:
        return <SuppliesDropOff data={processState.dropOff} onChange={(v) => updateStep("dropOff", v)} />;
      case 6:
        return <TimeEntry data={processState.timeEntry} onChange={(v) => updateStep("timeEntry", v)} />;
      case 7:
        return <CompletionStep data={processState.completed} onChange={(v) => updateStep("completed", v)} processState={processState} job={job} />;
      default:
        return null;
    }
  };

  const isCompleted = processState.completed === true;

  return (
    <div className="space-y-5">
      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/install/calendar")}
            className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon icon="ph:arrow-left" className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Installation Process
            </h1>
            <p className="text-sm text-gray-500">
              {job.quote_no} — {job.fname} {job.lname} • {job.address}, {job.city}
            </p>
          </div>
        </div>

        {job.installer_name && (
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
              {job.installer_name.split(" ").map((n) => n[0]).join("")}
            </div>
            <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
              {job.installer_name}
            </span>
          </div>
        )}
      </div>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── Sidebar Steps ── */}
        <div className="lg:col-span-3">
          <Card className="!shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
            <div className="space-y-1">
              {PROCESS_STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const isPast = currentStep > step.id;
                const isCompletedStep = isCompleted;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => !isCompleted && setCurrentStep(step.id)}
                    disabled={isCompleted}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700"
                        : isPast || isCompletedStep
                        ? "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50 opacity-60"
                    }`}
                  >
                    {/* Step number/check */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        isCompletedStep || isPast
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isCompletedStep || isPast ? (
                        <Icon icon="ph:check-bold" className="text-sm" />
                      ) : (
                        step.id
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isActive
                            ? "text-indigo-700 dark:text-indigo-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>

                    <Icon
                      icon={step.icon}
                      className={`text-lg flex-shrink-0 ${
                        isActive ? "text-indigo-500" : "text-gray-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Content Area ── */}
        <div className="lg:col-span-9">
          {renderStep()}

          {/* ── Navigation Buttons ── */}
          {!isCompleted && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Button
                text="Previous"
                icon="ph:arrow-left"
                className="btn-outline-secondary"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              />

              <div className="flex items-center gap-2">
                {PROCESS_STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      step.id === currentStep
                        ? "bg-indigo-500"
                        : step.id < currentStep
                        ? "bg-green-400"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              {currentStep < 7 && (
                <Button
                  text="Next"
                  icon="ph:arrow-right"
                  className="btn-primary"
                  onClick={() => setCurrentStep((s) => Math.min(7, s + 1))}
                />
              )}
              {currentStep === 7 && <div />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallationProcess;
