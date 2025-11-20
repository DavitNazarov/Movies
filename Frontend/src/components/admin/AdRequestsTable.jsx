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
import { AdRequestRow } from "./AdRequestRow";
import { AdRequestsHistoryModal } from "./AdRequestsHistoryModal";
import { useState } from "react";

const formatDate = (value) =>
  value ? new Date(value).toLocaleString(undefined, { hour12: false }) : "";

export function AdRequestsTable({
  adRequests,
  adRequestsLoading,
  isSuperAdmin,
  adRequestDecisionId,
  onAdRequestDecision,
  onDeactivateAd,
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
        <h2 className="text-xl font-semibold">Ad Banner Requests</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing || adRequestsLoading}
          className="h-8 w-8"
          title="Refresh ad requests"
        >
          <RotateCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
      <Table>
        <TableCaption>
          {isSuperAdmin
            ? "Review and approve/decline ad banner requests."
            : "View ad banner requests (super admin can approve/decline)."}
        </TableCaption>
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
          {adRequestsLoading ? (
            <TableRow>
              <TableCell
                colSpan={isSuperAdmin ? 8 : 7}
                className="py-6 text-center text-muted-foreground"
              >
                Loading ad requests...
              </TableCell>
            </TableRow>
          ) : adRequests.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isSuperAdmin ? 8 : 7}
                className="py-6 text-center text-muted-foreground"
              >
                No ad requests yet.
              </TableCell>
            </TableRow>
          ) : (
            adRequests.map((request) => (
              <AdRequestRow
                key={request._id}
                request={request}
                isSuperAdmin={isSuperAdmin}
                adRequestDecisionId={adRequestDecisionId}
                onAdRequestDecision={onAdRequestDecision}
                onDeactivateAd={onDeactivateAd}
                formatDate={formatDate}
              />
            ))
          )}
        </TableBody>
      </Table>
      <div className="mt-4">
        <AdRequestsHistoryModal
          isSuperAdmin={isSuperAdmin}
          adRequestDecisionId={adRequestDecisionId}
          onAdRequestDecision={onAdRequestDecision}
          onDeactivateAd={onDeactivateAd}
          onRefresh={onRefresh}
        />
      </div>
    </section>
  );
}

