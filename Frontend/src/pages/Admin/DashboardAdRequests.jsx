import React, { useCallback, useEffect, useState } from "react";
import { api, getErr } from "@/lib/api";
import Loading from "@/components/ui/Loading";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { AdRequestsTable } from "@/components/admin/AdRequestsTable";

const DashboardAdRequests = () => {
  const [adRequests, setAdRequests] = useState([]);
  const [adRequestsLoading, setAdRequestsLoading] = useState(false);
  const [adRequestDecisionId, setAdRequestDecisionId] = useState(null);
  const { user: currentUser } = useAuth();

  const isAdmin = Boolean(currentUser?.isAdmin);
  const isSuperAdmin = Boolean(currentUser?.isSuperAdmin);

  const loadAdRequests = useCallback(async () => {
    if (!isAdmin) return;
    setAdRequestsLoading(true);
    try {
      const { data } = await api.get("/api/ad-requests");
      setAdRequests(data.requests ?? []);
    } catch (err) {
      const msg = getErr(err);
      if (isSuperAdmin) toast.error(msg);
    } finally {
      setAdRequestsLoading(false);
    }
  }, [isAdmin, isSuperAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    loadAdRequests();
  }, [isAdmin, loadAdRequests]);

  const handleAdRequestDecision = useCallback(
    async (id, decision) => {
      if (!isSuperAdmin) return;
      setAdRequestDecisionId(id);
      try {
        await api.post(`/api/ad-requests/${id}/decision`, { decision });
        await loadAdRequests();
        toast.success(`Ad request ${decision}`);
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setAdRequestDecisionId(null);
      }
    },
    [isSuperAdmin, loadAdRequests]
  );

  const handleDeactivateAd = useCallback(
    async (id) => {
      if (!isSuperAdmin) return;
      setAdRequestDecisionId(id);
      try {
        await api.post(`/api/ad-requests/${id}/decision`, {
          decision: "deactivated",
        });
        await loadAdRequests();
        toast.success("Ad deactivated");
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setAdRequestDecisionId(null);
      }
    },
    [isSuperAdmin, loadAdRequests]
  );

  if (!isAdmin) {
    return <div className="p-6">Access denied. Admin only.</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Ad Requests</h1>
      <AdRequestsTable
        adRequests={adRequests}
        adRequestsLoading={adRequestsLoading}
        isSuperAdmin={isSuperAdmin}
        adRequestDecisionId={adRequestDecisionId}
        onAdRequestDecision={handleAdRequestDecision}
        onDeactivateAd={handleDeactivateAd}
        onRefresh={loadAdRequests}
      />
    </div>
  );
};

export default DashboardAdRequests;

