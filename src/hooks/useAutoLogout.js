import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "@/store/auth/authSlice";

// ─── Configuration ───────────────────────────────────────────────
// const INACTIVITY_TIMEOUT = 30 * 1000; // 30 seconds in ms

const INACTIVITY_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in ms
const CHECK_INTERVAL = 60 * 1000; // check every 60 seconds
const THROTTLE_DELAY = 30 * 1000; // update timestamp max once per 30s
// ─────────────────────────────────────────────────────────────────

/**
 * useAutoLogout
 *
 * Monitors user activity (clicks, key presses, mouse moves, scrolls, touches).
 * If no activity is detected for INACTIVITY_TIMEOUT (8 hours), the user is
 * automatically logged out and redirected to the login page.
 *
 * Features:
 *  - Throttled localStorage writes to avoid performance overhead
 *  - Cross-tab synchronisation via the `storage` event
 *  - Survives page refreshes (timestamp persisted in localStorage)
 */
const useAutoLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.auth);
  const lastUpdateRef = useRef(0);

  // ── Throttled activity timestamp update ──────────────────────────
  const updateActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current > THROTTLE_DELAY) {
      localStorage.setItem("lastActivityTime", now.toString());
      lastUpdateRef.current = now;
    }
  }, []);

  // ── Force logout with toast notification ─────────────────────────
  const performLogout = useCallback(() => {
    dispatch(logout());
    toast.info(
      "Session expired due to inactivity. Please login again.",
      { toastId: "auto-logout" }
    );
    navigate("/");
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!isAuth) return; // Only run when authenticated

    // Set initial activity timestamp if missing (e.g. existing sessions
    // that were created before this feature was added)
    if (!localStorage.getItem("lastActivityTime")) {
      localStorage.setItem("lastActivityTime", Date.now().toString());
    }

    // ── Check immediately on mount (covers browser reopen after long idle) ─
    const lastOnMount = parseInt(
      localStorage.getItem("lastActivityTime") || "0",
      10
    );
    if (Date.now() - lastOnMount >= INACTIVITY_TIMEOUT) {
      performLogout();
      return; // no need to set up listeners
    }

    // ── Activity event listeners ───────────────────────────────────
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) =>
      window.addEventListener(e, updateActivity, { passive: true })
    );

    // ── Periodic expiry check ──────────────────────────────────────
    const intervalId = setInterval(() => {
      const last = parseInt(
        localStorage.getItem("lastActivityTime") || "0",
        10
      );
      if (Date.now() - last >= INACTIVITY_TIMEOUT) {
        performLogout();
      }
    }, CHECK_INTERVAL);

    // ── Cross-tab sync: detect logout from another tab ─────────────
    const onStorageChange = (e) => {
      if (e.key === "user" && e.newValue === null) {
        dispatch(logout());
        navigate("/");
      }
    };
    window.addEventListener("storage", onStorageChange);

    // ── Cleanup ────────────────────────────────────────────────────
    return () => {
      events.forEach((e) => window.removeEventListener(e, updateActivity));
      clearInterval(intervalId);
      window.removeEventListener("storage", onStorageChange);
    };
  }, [isAuth, updateActivity, performLogout, dispatch, navigate]);
};

export default useAutoLogout;
