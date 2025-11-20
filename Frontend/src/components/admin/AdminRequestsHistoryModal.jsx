import { useState, useEffect } from "react";
import { History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { api, getErr } from "@/lib/api";
import Loading from "@/components/ui/Loading";
import { AdminRequestRow } from "./AdminRequestRow";
import { cn } from "@/lib/utils";

const ACTION_LABELS = {
  delete_user: "Delete user",
  promote_admin: "Promote to admin",
  demote_admin: "Remove admin",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleString(undefined, { hour12: false }) : "";

export function AdminRequestsHistoryModal({
  isSuperAdmin,
  requestDecisionId,
  onAdminActionDecision,
  onRefresh,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/admin-requests/history");
      setHistory(data.requests ?? []);
    } catch (err) {
      const msg = getErr(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const handleDecision = async (requestId, decision) => {
    await onAdminActionDecision(requestId, decision);
    await loadHistory();
    if (onRefresh) onRefresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <History className="mr-2 h-4 w-4" />
          View History (Last 30 Days)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Requests History</DialogTitle>
          <DialogDescription>
            View all admin action requests from the last 30 days
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No history found
            </div>
          ) : (
            <Table>
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
                {history.map((request) => (
                  <AdminRequestRow
                    key={request._id}
                    request={request}
                    isSuperAdmin={isSuperAdmin}
                    requestDecisionId={requestDecisionId}
                    onAdminActionDecision={handleDecision}
                    formatDate={formatDate}
                    ACTION_LABELS={ACTION_LABELS}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

