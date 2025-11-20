import { Check, X, RotateCw } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { AdminRequestRow } from "./AdminRequestRow";
import { AdminRequestsHistoryModal } from "./AdminRequestsHistoryModal";
import { useState } from "react";

const ACTION_LABELS = {
  delete_user: "Delete user",
  promote_admin: "Promote to admin",
  demote_admin: "Remove admin",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleString(undefined, { hour12: false }) : "";

export function AdminRequestsTable({
  requests,
  requestsLoading,
  requestsError,
  isSuperAdmin,
  requestDecisionId,
  onAdminActionDecision,
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
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Admin action requests</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing || requestsLoading}
          className="h-8 w-8"
          title="Refresh admin requests"
        >
          <RotateCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
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
            requests.map((request) => (
              <AdminRequestRow
                key={request._id}
                request={request}
                isSuperAdmin={isSuperAdmin}
                requestDecisionId={requestDecisionId}
                onAdminActionDecision={onAdminActionDecision}
                formatDate={formatDate}
                ACTION_LABELS={ACTION_LABELS}
              />
            ))
          )}
        </TableBody>
      </Table>
      <div className="mt-4">
        <AdminRequestsHistoryModal
          isSuperAdmin={isSuperAdmin}
          requestDecisionId={requestDecisionId}
          onAdminActionDecision={onAdminActionDecision}
          onRefresh={onRefresh}
        />
      </div>
    </section>
  );
}

