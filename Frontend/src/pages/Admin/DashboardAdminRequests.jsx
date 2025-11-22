import React, { useCallback, useEffect, useState } from "react";
import { api, getErr } from "@/lib/api";
import Loading from "@/components/ui/Loading";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { AdminRequestsTable } from "@/components/admin/AdminRequestsTable";

const DashboardAdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [requestDecisionId, setRequestDecisionId] = useState(null);
  const { user: currentUser } = useAuth();

  const isAdmin = Boolean(currentUser?.isAdmin);
  const isSuperAdmin = Boolean(currentUser?.isSuperAdmin);

  const loadRequests = useCallback(async () => {
    if (!isAdmin) return;
    setRequestsLoading(true);
    setRequestsError("");
    try {
      const { data } = await api.get("/api/admin-requests");
      setRequests(data.requests ?? []);
    } catch (err) {
      const msg = getErr(err);
      setRequestsError(msg);
      if (isSuperAdmin) toast.error(msg);
    } finally {
      setRequestsLoading(false);
    }
  }, [isAdmin, isSuperAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    loadRequests();
  }, [isAdmin, loadRequests]);

  const handleAdminActionDecision = useCallback(
    async (id, decision, responseMessage) => {
      if (!isSuperAdmin) return;
      setRequestDecisionId(id);
      try {
        await api.post(`/api/admin-requests/${id}/decision`, {
          decision,
          responseMessage,
        });
        await loadRequests();
        toast.success(`Request ${decision}`);
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setRequestDecisionId(null);
      }
    },
    [isSuperAdmin, loadRequests]
  );

  if (!isAdmin) {
    return <div className="p-6">Access denied. Admin only.</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Admin Requests</h1>
      <AdminRequestsTable
        requests={requests}
        requestsLoading={requestsLoading}
        requestsError={requestsError}
        isSuperAdmin={isSuperAdmin}
        requestDecisionId={requestDecisionId}
        onAdminActionDecision={handleAdminActionDecision}
        onRefresh={loadRequests}
      />
    </div>
  );
};

export default DashboardAdminRequests;

