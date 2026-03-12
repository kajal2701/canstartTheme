import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import PastInstallations from "../../components/install/pastInstallations";
import UpcomingInstallations from "../../components/install/upcomingInstallations";
import AwaitingInstallationSchedule from "../../components/install/awaitingInstallationSchedule";
import { getInstalls } from "../../services/installService";
import { useSelector } from "react-redux";

const Install = () => {
  const { user } = useSelector((state) => state.auth);
  const [installs, setInstalls] = useState({
    upcoming_installations: [],
    non_scheduled_jobs: [],
    past_installations_pending_invoice: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadInstalls = async () => {
    try {
      setLoading(true);
      setError(null);
      const uid = user?.user_id ?? "";
      const role = user?.role ?? "";
      const data = await getInstalls(uid, role);
      setInstalls(data);
    } catch (err) {
      setError(err.message || "Failed to load installs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstalls();
  }, []);

  const upcomingCount = installs.upcoming_installations?.length ?? 0;
  const pastCount = installs.past_installations_pending_invoice?.length ?? 0;
  const awaitingCount = installs.non_scheduled_jobs?.length ?? 0;

  return (
    <div className="space-y-5">
      {/* ── Stats Cards ── */}
      <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
        {/* Upcoming Installations */}
        <Card>
          <div className="text-center py-2">
            <div className="text-4xl font-bold text-indigo-500 mb-2">
              {upcomingCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Upcoming Installations
            </div>
          </div>
        </Card>

        {/* Past — Pending Invoice — highlighted with left red border like image */}
        <Card className="border-l-4 border-l-red-500">
          <div className="text-center py-2">
            <div className="text-4xl font-bold text-red-500 mb-2">
              {pastCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Past - Pending Invoice
            </div>
          </div>
        </Card>

        {/* Awaiting Schedule */}
        <Card>
          <div className="text-center py-2">
            <div className="text-4xl font-bold text-indigo-500 mb-2">
              {awaitingCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Awaiting Schedule
            </div>
          </div>
        </Card>
      </div>

      {/* ── Tables ── */}
      <div className="space-y-5">
        <PastInstallations
          jobs={installs.past_installations_pending_invoice}
          loading={loading}
          onRefresh={loadInstalls}
        />
        <UpcomingInstallations
          jobs={installs.upcoming_installations}
          loading={loading}
          onRefresh={loadInstalls}
        />
        <AwaitingInstallationSchedule
          jobs={installs.non_scheduled_jobs}
          loading={loading}
          onRefresh={loadInstalls}
        />
      </div>
    </div>
  );
};

export default Install;
