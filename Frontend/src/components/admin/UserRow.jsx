import { BadgeCheck, Check, X } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function UserRow({
  user,
  index,
  currentUser,
  isSuperAdmin,
  decisionUserId,
  updatingStatusId,
  deletingId,
  submittingActionKey,
  hasPendingAction,
  onUserAdminDecision,
  onDirectStatusChange,
  onDelete,
  onSubmitActionRequest,
}) {
  const isSelf = user._id === currentUser?._id;
  const pendingPromotion = user.adminRequestStatus === "pending";
  const canRequestDelete =
    !isSuperAdmin && !isSelf && !user.isSuperAdmin;
  const canRequestPromote = !isSuperAdmin && !user.isAdmin && !isSelf;
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
            <BadgeCheck className="size-3" />
            {user.adminRequestResolvedAt
              ? "Approved"
              : "Made by super admin"}
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
                onClick={() => onUserAdminDecision(user._id, "reject")}
              >
                <X className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-emerald-600 hover:text-emerald-700"
                disabled={decisionUserId === user._id}
                onClick={() => onUserAdminDecision(user._id, "approve")}
              >
                <Check className="size-4" />
              </Button>
            </>
          )}

          {isSuperAdmin && !isSelf && !user.isSuperAdmin && (
            <Button
              variant="outline"
              size="sm"
              disabled={updatingStatusId === user._id}
              onClick={() =>
                onDirectStatusChange(user._id, {
                  isAdmin: !user.isAdmin,
                })
              }
            >
              {updatingStatusId === user._id
                ? "Updating..."
                : user.isAdmin
                  ? "Remove admin"
                  : "Make admin"}
            </Button>
          )}

          {canRequestDelete && (
            <Button
              variant="outline"
              size="sm"
              disabled={
                submittingActionKey === `${user._id}:delete_user` ||
                hasPendingAction(user._id, "delete_user")
              }
              onClick={() => onSubmitActionRequest(user._id, "delete_user")}
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
                submittingActionKey === `${user._id}:promote_admin` ||
                hasPendingAction(user._id, "promote_admin")
              }
              onClick={() => onSubmitActionRequest(user._id, "promote_admin")}
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
                submittingActionKey === `${user._id}:demote_admin` ||
                hasPendingAction(user._id, "demote_admin")
              }
              onClick={() => onSubmitActionRequest(user._id, "demote_admin")}
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
              onClick={() => onDelete(user._id)}
            >
              {deletingId === user._id ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

