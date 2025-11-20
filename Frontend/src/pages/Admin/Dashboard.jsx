import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api, getErr } from "@/lib/api";
import Loading from "@/components/ui/Loading";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { UsersTable } from "@/components/admin/UsersTable";
import { AdminRequestsTable } from "@/components/admin/AdminRequestsTable";
import { AdRequestsTable } from "@/components/admin/AdRequestsTable";

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value._id) return value._id;
    if (value.id) return value.id;
    if (value.toString) return value.toString();
  }
  return String(value);
};

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [decisionUserId, setDecisionUserId] = useState(null);
  const [requestDecisionId, setRequestDecisionId] = useState(null);
  const [submittingActionKey, setSubmittingActionKey] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [adRequests, setAdRequests] = useState([]);
  const [adRequestsLoading, setAdRequestsLoading] = useState(false);
  const [adRequestDecisionId, setAdRequestDecisionId] = useState(null);
  const { user: currentUser } = useAuth();

  const isAdmin = Boolean(currentUser?.isAdmin);
  const isSuperAdmin = Boolean(currentUser?.isSuperAdmin);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const { data } = await api.get("/api/users");
      setUsers(data.users ?? data ?? []);
    } catch (err) {
      const msg = getErr(err);
      setUsersError(msg);
      toast.error(msg);
    } finally {
      setUsersLoading(false);
    }
  }, []);

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
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!isAdmin) return;
    loadRequests();
    // Removed auto-refresh interval - tables only refresh on button click or page reload
  }, [isAdmin, loadRequests]);

  useEffect(() => {
    if (!isAdmin) return;
    loadAdRequests();
    // Removed auto-refresh interval - tables only refresh on button click or page reload
  }, [isAdmin, loadAdRequests]);

  const handleAdRequestDecision = useCallback(
    async (requestId, decision) => {
      if (!isSuperAdmin) return;
      setAdRequestDecisionId(requestId);
      try {
        await api.post(`/api/ad-requests/${requestId}/decision`, {
          decision,
        });
        toast.success(
          decision === "approve" ? "Ad request approved" : "Ad request declined"
        );
        await loadAdRequests();
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setAdRequestDecisionId(null);
      }
    },
    [isSuperAdmin, loadAdRequests]
  );

  const handleDeactivateAd = useCallback(
    async (requestId) => {
      if (!isSuperAdmin) return;
      setAdRequestDecisionId(requestId);
      try {
        await api.post(`/api/ad-requests/${requestId}/deactivate`);
        toast.success("Ad has been deactivated");
        await loadAdRequests();
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setAdRequestDecisionId(null);
      }
    },
    [isSuperAdmin, loadAdRequests]
  );

  const pendingUserRequests = useMemo(
    () => users.filter((user) => user.adminRequestStatus === "pending"),
    [users]
  );

  const pendingAdminActionRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests]
  );

  const hasPendingAction = useCallback(
    (targetId, action) => {
      if (!isAdmin) return false;
      const myId = normalizeId(currentUser?._id);
      const tid = normalizeId(targetId);
      return requests.some((request) => {
        if (request.status !== "pending") return false;
        if (request.action !== action) return false;
        const requesterId = normalizeId(request.requester);
        const requestTargetId = normalizeId(request.targetId || request.target);
        return requesterId === myId && requestTargetId === tid;
      });
    },
    [requests, currentUser?._id, isAdmin]
  );

  const refreshData = useCallback(async () => {
    await loadUsers();
    await loadRequests();
  }, [loadUsers, loadRequests]);

  const handleSubmitActionRequest = useCallback(
    async (targetId, action) => {
      if (!isAdmin || isSuperAdmin) return;
      const key = `${targetId}:${action}`;
      setSubmittingActionKey(key);
      try {
        await api.post("/api/admin-requests", { targetId, action });
        toast.success("Request sent to super admin");
        await loadRequests();
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setSubmittingActionKey(null);
      }
    },
    [isAdmin, isSuperAdmin, loadRequests]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!isSuperAdmin) {
        await handleSubmitActionRequest(id, "delete_user");
        return;
      }

      if (id === currentUser?._id) {
        toast.error("You cannot delete your own account");
        return;
      }

      const confirmed = window.confirm(
        "Delete this user? This action cannot be undone."
      );
      if (!confirmed) return;

      setDeletingId(id);
      try {
        await api.delete(`/api/users/${id}`);
        toast.success("User deleted");
        await loadUsers();
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setDeletingId(null);
      }
    },
    [currentUser?._id, isSuperAdmin, handleSubmitActionRequest, loadUsers]
  );

  const handleUserAdminDecision = useCallback(
    async (id, action) => {
      setDecisionUserId(id);
      try {
        const { data } = await api.post(`/api/users/${id}/admin-request`, {
          action,
        });
        if (data?.user) {
          setUsers((prev) =>
            prev.map((item) =>
              item._id === id ? { ...item, ...data.user } : item
            )
          );
        } else {
          await loadUsers();
        }
        toast.success(
          action === "approve" ? "Admin access granted" : "Request rejected"
        );
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setDecisionUserId(null);
      }
    },
    [loadUsers]
  );

  const handleAdminActionDecision = useCallback(
    async (requestId, decision) => {
      setRequestDecisionId(requestId);
      try {
        await api.post(`/api/admin-requests/${requestId}/decision`, {
          decision,
        });
        toast.success(
          decision === "approve" ? "Request approved" : "Request declined"
        );
        await refreshData();
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setRequestDecisionId(null);
      }
    },
    [refreshData]
  );

  const handleDirectStatusChange = useCallback(
    async (id, updates) => {
      if (!isSuperAdmin) return;
      setUpdatingStatusId(id);
      try {
        const { data } = await api.patch(`/api/users/${id}/status`, updates);
        if (data?.user) {
          setUsers((prev) =>
            prev.map((item) =>
              item._id === id ? { ...item, ...data.user } : item
            )
          );
        } else {
          await loadUsers();
        }
        toast.success("Status updated");
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setUpdatingStatusId(null);
      }
    },
    [isSuperAdmin, loadUsers]
  );

  if (usersLoading) return <Loading />;
  if (usersError)
    return <div className="text-red-500">Error: {usersError}</div>;

  return (
    <div className="space-y-8 p-6">
      <DashboardHeader
        pendingUserRequests={pendingUserRequests}
        pendingAdminActionRequests={pendingAdminActionRequests}
        isSuperAdmin={isSuperAdmin}
      />

      <UsersTable
        users={users}
        currentUser={currentUser}
        isSuperAdmin={isSuperAdmin}
        decisionUserId={decisionUserId}
        updatingStatusId={updatingStatusId}
        deletingId={deletingId}
        submittingActionKey={submittingActionKey}
        hasPendingAction={hasPendingAction}
        handleUserAdminDecision={handleUserAdminDecision}
        handleDirectStatusChange={handleDirectStatusChange}
        handleDelete={handleDelete}
        handleSubmitActionRequest={handleSubmitActionRequest}
        onRefresh={loadUsers}
      />

      {isAdmin && (
        <AdminRequestsTable
          requests={requests}
          requestsLoading={requestsLoading}
          requestsError={requestsError}
          isSuperAdmin={isSuperAdmin}
          requestDecisionId={requestDecisionId}
          onAdminActionDecision={handleAdminActionDecision}
          onRefresh={loadRequests}
        />
      )}

      {isAdmin && (
        <AdRequestsTable
          adRequests={adRequests}
          adRequestsLoading={adRequestsLoading}
          isSuperAdmin={isSuperAdmin}
          adRequestDecisionId={adRequestDecisionId}
          onAdRequestDecision={handleAdRequestDecision}
          onDeactivateAd={handleDeactivateAd}
          onRefresh={loadAdRequests}
        />
      )}
    </div>
  );
};

export default Dashboard;
