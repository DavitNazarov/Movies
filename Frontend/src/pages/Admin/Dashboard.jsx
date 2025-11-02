import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { api, getErr } from "@/lib/api";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { BadgeCheck, BellRing, Check, Clock, X } from "lucide-react";

const ACTION_LABELS = {
  delete_user: "Delete user",
  promote_admin: "Promote to admin",
  demote_admin: "Remove admin",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleString(undefined, { hour12: false }) : "";

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

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!isAdmin) return;
    loadRequests();
    const interval = setInterval(loadRequests, 8000);
    return () => clearInterval(interval);
  }, [isAdmin, loadRequests]);

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

  if (usersLoading) return <Loading />;
  if (usersError)
    return <div className="text-red-500">Error: {usersError}</div>;

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        {pendingUserRequests.length > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            <BellRing className="size-4" />
            {pendingUserRequests.length} user promotion pending
          </span>
        )}
        {isSuperAdmin && pendingAdminActionRequests.length > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
            <Clock className="size-4" />
            {pendingAdminActionRequests.length} admin requests waiting
          </span>
        )}
      </div>

      <Table>
        <TableCaption>Manage user accounts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Request</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-6 text-center text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => {
              const isSelf = user._id === currentUser?._id;
              const pendingPromotion = user.adminRequestStatus === "pending";
              const canRequestDelete =
                !isSuperAdmin && !isSelf && !user.isSuperAdmin;
              const canRequestPromote =
                !isSuperAdmin && !user.isAdmin && !isSelf;
              const canRequestDemote =
                !isSuperAdmin && user.isAdmin && !user.isSuperAdmin && !isSelf;

              return (
                <TableRow key={user._id || user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.isAdmin ? "Yes" : "No"}</TableCell>
                  <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {pendingPromotion && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                        Pending
                      </span>
                    )}
                    {user.adminRequestStatus === "approved" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                        <BadgeCheck className="size-3" /> Approved
                      </span>
                    )}
                    {user.adminRequestStatus === "declined" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-800">
                        Declined
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {isSuperAdmin && pendingPromotion && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-rose-600 hover:text-rose-700"
                            disabled={decisionUserId === user._id}
                            onClick={() =>
                              handleUserAdminDecision(user._id, "reject")
                            }
                          >
                            <X className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-emerald-600 hover:text-emerald-700"
                            disabled={decisionUserId === user._id}
                            onClick={() =>
                              handleUserAdminDecision(user._id, "approve")
                            }
                          >
                            <Check className="size-4" />
                          </Button>
                        </>
                      )}

                      {canRequestDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            submittingActionKey === `${user._id}:delete_user` ||
                            hasPendingAction(user._id, "delete_user")
                          }
                          onClick={() =>
                            handleSubmitActionRequest(user._id, "delete_user")
                          }
                        >
                          {hasPendingAction(user._id, "delete_user")
                            ? "Delete pending"
                            : "Request delete"}
                        </Button>
                      )}

                      {canRequestPromote && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            submittingActionKey ===
                              `${user._id}:promote_admin` ||
                            hasPendingAction(user._id, "promote_admin")
                          }
                          onClick={() =>
                            handleSubmitActionRequest(user._id, "promote_admin")
                          }
                        >
                          {hasPendingAction(user._id, "promote_admin")
                            ? "Promotion pending"
                            : "Request promote"}
                        </Button>
                      )}

                      {canRequestDemote && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            submittingActionKey ===
                              `${user._id}:demote_admin` ||
                            hasPendingAction(user._id, "demote_admin")
                          }
                          onClick={() =>
                            handleSubmitActionRequest(user._id, "demote_admin")
                          }
                        >
                          {hasPendingAction(user._id, "demote_admin")
                            ? "Demotion pending"
                            : "Request demote"}
                        </Button>
                      )}

                      {isSuperAdmin && !isSelf && !user.isSuperAdmin && (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === user._id}
                          onClick={() => handleDelete(user._id)}
                        >
                          {deletingId === user._id ? "Deleting..." : "Delete"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {isAdmin && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Admin action requests</h2>
          <Table>
            <TableCaption>
              {isSuperAdmin
                ? "Review and resolve admin action requests."
                : "Track the status of your requests."}
            </TableCaption>
            <TableHeader>
              <TableRow>
                {isSuperAdmin && <TableHead>Requester</TableHead>}
                <TableHead>Target</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Response</TableHead>
                {isSuperAdmin && (
                  <TableHead className="text-right">Decision</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestsLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={isSuperAdmin ? 7 : 5}
                    className="py-6 text-center text-muted-foreground"
                  >
                    Loading requests...
                  </TableCell>
                </TableRow>
              ) : requestsError ? (
                <TableRow>
                  <TableCell
                    colSpan={isSuperAdmin ? 7 : 5}
                    className="py-6 text-center text-rose-500"
                  >
                    {requestsError}
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isSuperAdmin ? 7 : 5}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No admin requests yet.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => {
                  const requestTarget = request.target;
                  const targetName =
                    requestTarget?.name || request.targetName || "Unknown";
                  const targetEmail =
                    requestTarget?.email || request.targetEmail || "";
                  const status = request.status;
                  const isPending = status === "pending";

                  return (
                    <TableRow key={request._id}>
                      {isSuperAdmin && (
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{request.requester?.name || "Unknown"}</span>
                            <span className="text-xs text-muted-foreground">
                              {request.requester?.email}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{targetName}</span>
                          {targetEmail && (
                            <span className="text-xs text-muted-foreground">
                              {targetEmail}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{ACTION_LABELS[request.action]}</TableCell>
                      <TableCell>
                        {status === "pending" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                            Pending
                          </span>
                        )}
                        {status === "approved" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                            Approved
                          </span>
                        )}
                        {status === "declined" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-800">
                            Declined
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>
                        {request.responseMessage
                          ? request.responseMessage
                          : status === "pending"
                          ? "Awaiting response"
                          : "—"}
                      </TableCell>
                      {isSuperAdmin && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-rose-600 hover:text-rose-700"
                              disabled={
                                !isPending || requestDecisionId === request._id
                              }
                              onClick={() =>
                                handleAdminActionDecision(
                                  request._id,
                                  "decline"
                                )
                              }
                            >
                              <X className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-emerald-600 hover:text-emerald-700"
                              disabled={
                                !isPending || requestDecisionId === request._id
                              }
                              onClick={() =>
                                handleAdminActionDecision(
                                  request._id,
                                  "approve"
                                )
                              }
                            >
                              <Check className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
