import { getTakenItemsList } from "@/components/install/process/PostInstallationChecklist";

export const validateStep = (step, processState) => {
  if (step === 1) {
    const d = processState?.prep || {};
    // Required: track type and screws must be selected
    if (!d.trackType || !d.screws) return false;

    // All quote products must be picked
    const quoteProducts = d.quoteProducts || [];
    if (quoteProducts.length > 0 && quoteProducts.some((p) => !p.picked)) return false;

    // Checked optional items must have qty > 0
    const optionalKeys = ["conduit", "cableTie", "connectorsBag"];
    for (const key of optionalKeys) {
      if (d[key] && (!d[`${key}Qty`] || Number(d[`${key}Qty`]) <= 0)) {
        return false;
      }
    }

    // Each "other" item must have non-empty name and qty > 0
    const otherItems = d.otherItems || [];
    for (const item of otherItems) {
      if (!item.name || item.name.trim() === "" || !item.qty || Number(item.qty) <= 0) {
        return false;
      }
    }

    return true;
  }

  if (step === 2) {
    const d = processState?.onTheWay || {};
    // Must have clicked "I'm On My Way" and sent the notification with a valid ETA
    if (!d.sent || !d.etaMinutes) return false;
    return true;
  }

  if (step === 4) {
    const prepData = processState?.prep || {};
    const postData = processState?.postInstall || {};
    const checklist = postData.checklist || {};

    // Validate checklist "used" fields
    const takenItems = getTakenItemsList(prepData);
    for (const item of takenItems) {
      const row = checklist[item.key] || {};
      if (row.used === undefined || row.used === "" || row.used === null) {
        return false;
      }
    }

    // Validate added dynamic items
    const addedItems = postData.addedItems || [];
    for (const item of addedItems) {
      if (
        !item.name ||
        item.name.trim() === "" ||
        item.qty === undefined ||
        item.qty === "" ||
        Number(item.qty) < 0 ||
        item.used === undefined ||
        item.used === "" ||
        Number(item.used) < 0
      ) {
        return false;
      }
    }
    return true;
  }

  if (step === 5) {
    const dropOffData = processState?.dropOff || {};
    const travelTime = dropOffData.travelTime || {};
    
    // Validate travel time > 0
    const hours = Number(travelTime.hours) || 0;
    const minutes = Number(travelTime.minutes) || 0;
    if (hours === 0 && minutes === 0) {
      return false;
    }

    // Validate returned items
    const items = dropOffData.items || [];
    for (const item of items) {
      if (
        !item.name || 
        item.name.trim() === "" || 
        item.qtyReturned === undefined || 
        item.qtyReturned === "" || 
        Number(item.qtyReturned) <= 0
      ) {
        return false;
      }
    }
    return true;
  }

  if (step === 6) {
    const timeData = processState?.timeEntry || {};
    const totalTime = timeData.totalTime || {};
    
    const hours = Number(totalTime.hours) || 0;
    const minutes = Number(totalTime.minutes) || 0;
    if (hours === 0 && minutes === 0) {
      return false;
    }

    const expenses = timeData.expenses || [];
    for (const exp of expenses) {
      if (!exp.description || exp.description.trim() === "" || exp.amount === undefined || exp.amount === "" || Number(exp.amount) <= 0) {
        return false;
      }
    }
    return true;
  }

  // Assume other steps are valid for now
  return true;
};
