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
import { AdRequestRow } from "./AdRequestRow";

const formatDate = (value) =>
  value ? new Date(value).toLocaleString(undefined, { hour12: false }) : "";

export function AdRequestsHistoryModal({
  isSuperAdmin,
  adRequestDecisionId,
  onAdRequestDecision,
  onDeactivateAd,
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
      const { data } = await api.get("/api/ad-requests/history");
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
    await onAdRequestDecision(requestId, decision);
    await loadHistory();
    if (onRefresh) {
      await onRefresh();
    }
  };

  const handleDeactivate = async (requestId) => {
    if (onDeactivateAd) {
      await onDeactivateAd(requestId);
      await loadHistory();
      if (onRefresh) {
        await onRefresh();
      }
    }
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
          <DialogTitle>Ad Requests History</DialogTitle>
          <DialogDescription>
            View all ad banner requests from the last 30 days
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
                  <TableHead>Requester</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Link URL</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  {isSuperAdmin && (
                    <TableHead className="text-right">Decision</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((request) => (
                  <AdRequestRow
                    key={request._id}
                    request={request}
                    isSuperAdmin={isSuperAdmin}
                    adRequestDecisionId={adRequestDecisionId}
                    onAdRequestDecision={handleDecision}
                    onDeactivateAd={handleDeactivate}
                    formatDate={formatDate}
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

