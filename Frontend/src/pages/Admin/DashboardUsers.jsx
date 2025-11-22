import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api, getErr } from "@/lib/api";
import Loading from "@/components/ui/Loading";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { UsersTable } from "@/components/admin/UsersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, UserX } from "lucide-react";

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

const DashboardUsers = () => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    unverifiedUsers: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [decisionUserId, setDecisionUserId] = useState(null);
  const [submittingActionKey, setSubmittingActionKey] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const { user: currentUser } = useAuth();

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

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await api.get("/api/users/stats");
      if (data?.success && data?.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [loadUsers, loadStats]);

  const handleDelete = useCallback(
    async (id) => {
      if (!isSuperAdmin) return;
      setDeletingId(id);
      try {
        await api.delete(`/api/users/${id}`);
        await loadUsers();
        await loadStats();
        toast.success("User deleted");
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setDeletingId(null);
      }
    },
    [isSuperAdmin, loadUsers, loadStats]
  );

  const handleUserAdminDecision = useCallback(
    async (id, decision) => {
      if (!isSuperAdmin) return;
      setDecisionUserId(id);
      try {
        await api.post(`/api/users/${id}/admin-request`, { decision });
        await loadUsers();
        await loadStats();
        toast.success(`User ${decision === "approved" ? "promoted" : "request declined"}`);
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setDecisionUserId(null);
      }
    },
    [isSuperAdmin, loadUsers, loadStats]
  );

  const handleSubmitActionRequest = useCallback(
    async (id, action, message) => {
      const key = `${id}-${action}`;
      setSubmittingActionKey(key);
      try {
        await api.post(`/api/users/${id}/admin-request`, {
          action,
          message,
        });
        await loadUsers();
        toast.success("Request submitted");
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setSubmittingActionKey(null);
      }
    },
    [loadUsers]
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
        await loadStats();
        toast.success("Status updated");
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setUpdatingStatusId(null);
      }
    },
    [isSuperAdmin, loadUsers, loadStats]
  );

  const hasPendingAction = useMemo(() => {
    return users.some(
      (u) =>
        u.adminRequestStatus === "pending" &&
        normalizeId(u._id) !== normalizeId(currentUser?._id)
    );
  }, [users, currentUser]);

  if (usersLoading) return <Loading />;
  if (usersError)
    return <div className="text-red-500">Error: {usersError}</div>;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Users Management</h1>
      
      {/* Statistics Boxes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.totalAdmins}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with admin privileges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unverified Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.unverifiedUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Users pending verification
            </p>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};

export default DashboardUsers;

