import { BadgeCheck, Check, X, RotateCw } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserRow } from "./UserRow";
import { UsersModal } from "./UsersModal";
import { useState } from "react";

export function UsersTable({
  users,
  currentUser,
  isSuperAdmin,
  decisionUserId,
  updatingStatusId,
  deletingId,
  submittingActionKey,
  hasPendingAction,
  handleUserAdminDecision,
  handleDirectStatusChange,
  handleDelete,
  handleSubmitActionRequest,
  onRefresh,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-8 w-8"
          title="Refresh users"
        >
          <RotateCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
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
            users.map((user, index) => (
              <UserRow
                key={user._id || user.id}
                user={user}
                index={index}
                currentUser={currentUser}
                isSuperAdmin={isSuperAdmin}
                decisionUserId={decisionUserId}
                updatingStatusId={updatingStatusId}
                deletingId={deletingId}
                submittingActionKey={submittingActionKey}
                hasPendingAction={hasPendingAction}
                onUserAdminDecision={handleUserAdminDecision}
                onDirectStatusChange={handleDirectStatusChange}
                onDelete={handleDelete}
                onSubmitActionRequest={handleSubmitActionRequest}
              />
            ))
          )}
        </TableBody>
      </Table>
      {users.length >= 10 && (
        <div className="mt-4">
          <UsersModal
            currentUser={currentUser}
            isSuperAdmin={isSuperAdmin}
            decisionUserId={decisionUserId}
            updatingStatusId={updatingStatusId}
            deletingId={deletingId}
            submittingActionKey={submittingActionKey}
            hasPendingAction={hasPendingAction}
            onUserAdminDecision={handleUserAdminDecision}
            onDirectStatusChange={handleDirectStatusChange}
            onDelete={handleDelete}
            onSubmitActionRequest={handleSubmitActionRequest}
          />
        </div>
      )}
    </div>
  );
}
