import { Check, X } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminRequestRow({
  request,
  isSuperAdmin,
  requestDecisionId,
  onAdminActionDecision,
  formatDate,
  ACTION_LABELS,
}) {
  const requestTarget = request.target;
  const targetName =
    requestTarget?.name || request.targetName || "Unknown";
  const targetEmail =
    requestTarget?.email || request.targetEmail || "";
  const status = request.status;
  const isPending = status === "pending";

  const rowClassName = cn(
    status === "pending"
      ? "bg-white shadow-sm ring-1 ring-amber-100/70"
      : "bg-zinc-50/70 text-zinc-500 backdrop-blur-[1px]"
  );

  return (
    <TableRow className={rowClassName}>
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
              disabled={!isPending || requestDecisionId === request._id}
              onClick={() => onAdminActionDecision(request._id, "decline")}
            >
              <X className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-emerald-600 hover:text-emerald-700"
              disabled={!isPending || requestDecisionId === request._id}
              onClick={() => onAdminActionDecision(request._id, "approve")}
            >
              <Check className="size-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

