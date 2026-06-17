import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { getDefaultProcessState } from "@/utils/helperFunctions";
import { PROCESS_STEPS, STEP_KEYS, DB_COLUMN_MAP } from "@/utils/constants";
import { getInstalls, getInstallProcess, saveInstallStep } from "@/services/installService";

import PrepStage from "@/components/install/process/PrepStage";
import OnTheWay from "@/components/install/process/OnTheWay";
import ControllerBoxLocation from "@/components/install/process/ControllerBoxLocation";
import PostInstallationChecklist from "@/components/install/process/PostInstallationChecklist";
import PostInstallationImages from "@/components/install/process/PostInstallationImages";
import SuppliesDropOff from "@/components/install/process/SuppliesDropOff";
import TimeEntry from "@/components/install/process/TimeEntry";
import CompletionStep from "@/components/install/process/CompletionStep";
import { validateStep } from "./validators";
import InstallationTopBar from "./InstallationTopBar";
import InstallationSidebar from "./InstallationSidebar";
import InstallationNavigation from "./InstallationNavigation";



const InstallationProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [processState, setProcessState] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSteps, setSavedSteps] = useState({}); // track which steps have been saved

  // ── Fetch job + saved process state from API ──
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch job data
        const data = await getInstalls(user?.user_id || "", user?.role || "");
        const allJobs = data?.upcoming_installations || [];
        const found = allJobs.find((j) => String(j.quote_id) === String(id));

        if (found) {
          setJob(found);

          // Fetch saved process state from DB
          const savedProcess = await getInstallProcess(id);

          if (savedProcess) {
            // Restore saved state — merge with defaults to fill any missing fields
            const defaults = getDefaultProcessState(found);
            const restored = {
              prep: savedProcess.prep_data || defaults.prep,
              onTheWay: savedProcess.on_the_way_data || defaults.onTheWay,
              controllerBox: savedProcess.controller_box_data || defaults.controllerBox,
              postInstall: savedProcess.post_install_data || defaults.postInstall,
              dropOff: savedProcess.drop_off_data || defaults.dropOff,
              timeEntry: savedProcess.time_entry_data || defaults.timeEntry,
              completed: savedProcess.status === "completed",
            };
            setProcessState(restored);
            setCurrentStep(savedProcess.current_step || 1);

            // Mark steps that have saved data
            const saved = {};
            for (let step = 1; step <= 6; step++) {
              if (savedProcess[DB_COLUMN_MAP[step]]) {
                saved[step] = true;
              }
            }
            if (savedProcess.status === "completed") saved[7] = true;
            setSavedSteps(saved);
          } else {
            // No saved data — use defaults
            setProcessState(getDefaultProcessState(found));
          }
        }
      } catch (err) {
        console.error("Failed to load job:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  // ── Validation helper (must be before early returns to preserve hook order) ──
  const isStepValid = useCallback(
    (step) => validateStep(step, processState),
    [processState]
  );

  // ── Update helpers (must be before early returns to preserve hook order) ──
  const isServerUpdate = React.useRef(false);

  const updateStep = (key, value) => {
    setProcessState((prev) => ({ ...prev, [key]: value }));
    // Skip unsave marking when updating from server response after save
    if (isServerUpdate.current) return;
    // Mark the step as unsaved when data changes
    const stepNum = Object.entries(STEP_KEYS).find(([, v]) => v === key)?.[0];
    if (stepNum) {
      setSavedSteps((prev) => ({ ...prev, [stepNum]: false }));
    }
  };

  const updatePostInstall = useCallback((patch) => {
    setProcessState((prev) => ({
      ...prev,
      postInstall: { ...(prev.postInstall || {}), ...patch },
    }));
    if (isServerUpdate.current) return;
    setSavedSteps((prev) => ({ ...prev, [4]: false }));
  }, []);

  // ── Save current step ──

  const handleSaveStep = async () => {
    if (currentStep === 7) return; // Step 7 uses the complete endpoint

    // Step 3 (Controller Box): validate photo is uploaded before saving
    if (currentStep === 3) {
      const cbData = processState?.controllerBox || {};
      if (!cbData.photo) {
        toast.error("Please upload a controller box location photo before saving.");
        return;
      }
    }

    if (!isStepValid(currentStep)) {
      toast.error("Please complete all required fields before continuing.");
      return;
    }

    const stepKey = STEP_KEYS[currentStep];
    if (!stepKey || !processState) return;

    setIsSaving(true);
    try {
      const stepData = processState[stepKey];

      // Step 3 (Controller Box): collect pending files for single FormData upload
      let pendingFiles = null;
      if (currentStep === 3) {
        const cbFile = stepData?.photo?.file || null;
        const assessmentFiles = (stepData?.preAssessmentImages || [])
          .filter((img) => img.file)
          .map((img) => img.file);

        if (cbFile || assessmentFiles.length > 0) {
          pendingFiles = {
            controllerBoxPhoto: cbFile,
            assessmentImages: assessmentFiles,
          };
        }
      }

      const result = await saveInstallStep({
        quote_id: parseInt(id),
        installer_id: job?.installer_id || user?.user_id || null,
        current_step: currentStep,
        step_data: stepData,
        pendingFiles,
      });

      // Update processState with server response (has file paths instead of File objects)
      // Use flag to prevent updateStep from marking it as unsaved
      isServerUpdate.current = true;
      if (result.step_data) {
        setProcessState((prev) => {
          isServerUpdate.current = false;
          return {
            ...prev,
            [stepKey]: result.step_data,
          };
        });
      } else {
        isServerUpdate.current = false;
      }

      setSavedSteps((prev) => ({ ...prev, [currentStep]: true }));
      toast.success(`Step ${currentStep} saved successfully!`);
    } catch (err) {
      console.error("Failed to save step:", err);
      toast.error("Failed to save. Please try again.");
      isServerUpdate.current = false;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Icon icon="ph:spinner" className="text-4xl text-indigo-500 animate-spin mb-4" />
        <p className="text-sm text-gray-500">Loading installation details...</p>
      </div>
    );
  }

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


  // ── Step mapping ──
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PrepStage data={processState.prep} onChange={(v) => updateStep("prep", v)} />;
      case 2:
        return <OnTheWay data={processState.onTheWay} onChange={(v) => updateStep("onTheWay", v)} job={job} />;
      case 3:
        return <ControllerBoxLocation data={processState.controllerBox} onChange={(v) => updateStep("controllerBox", v)} job={job} />;
      case 4:
        return (
          <div className="space-y-6">
            <PostInstallationChecklist data={processState.postInstall} onChange={updatePostInstall} prepData={processState.prep} />
            <PostInstallationImages data={processState.postInstall} onChange={updatePostInstall} />
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
  const isCurrentStepSaved = savedSteps[currentStep] === true;
  const isOptionalStep = currentStep === 3; // Controller Box is optional

  return (
    <div className="space-y-5">
      <InstallationTopBar
        job={job}
        currentStep={currentStep}
        isCurrentStepSaved={isCurrentStepSaved}
      />

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-3">
          <InstallationSidebar
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            isCompleted={isCompleted}
            savedSteps={savedSteps}
          />
        </div>

        <div className="lg:col-span-9">
          {renderStep()}

          <InstallationNavigation
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            isCompleted={isCompleted}
            isSaving={isSaving}
            handleSaveStep={handleSaveStep}
            isStepValid={isStepValid}
            isCurrentStepSaved={isCurrentStepSaved}
            savedSteps={savedSteps}
          />
        </div>
      </div>
    </div>
  );
};

export default InstallationProcess;
