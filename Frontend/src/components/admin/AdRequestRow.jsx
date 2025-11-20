import { Check, X, PowerOff } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Helper to ensure image URL points to backend
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  // If it's already a full URL, use it as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  // If it's a relative path starting with /uploads, use it as is (will be proxied in dev)
  if (imageUrl.startsWith("/uploads")) {
    return imageUrl;
  }
  // Otherwise, assume it's a relative path and prepend /uploads
  return `/uploads/${imageUrl}`;
};

export function AdRequestRow({
  request,
  isSuperAdmin,
  adRequestDecisionId,
  onAdRequestDecision,
  onDeactivateAd,
  formatDate,
}) {
  const status = request.status;
  const isPending = status === "pending";
  const now = new Date();
  const startDate = new Date(request.startDate);
  const endDate = new Date(request.endDate);
  const isActive =
    status === "approved" && startDate <= now && endDate >= now;
  const isExpired = endDate < now;

  const rowClassName = cn(
    status === "pending"
      ? "bg-white shadow-sm ring-1 ring-amber-100/70"
      : "bg-zinc-50/70 text-zinc-500 backdrop-blur-[1px]"
  );

  return (
    <TableRow className={rowClassName}>
      <TableCell>
        <div className="flex flex-col">
          <span>{request.requester?.name || "Unknown"}</span>
          <span className="text-xs text-muted-foreground">
            {request.requester?.email}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1 max-w-[200px]">
          <img
            src={getImageUrl(request.imageUrl)}
            alt="Ad preview"
            className="h-16 w-24 rounded object-cover"
            onError={(e) => {
              console.error("Failed to load ad image in table:", request.imageUrl);
              e.target.style.display = "none";
            }}
          />
          <a
            href={request.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline truncate block"
            title={request.imageUrl}
          >
            {request.imageUrl.length > 40
              ? `${request.imageUrl.substring(0, 40)}...`
              : request.imageUrl}
          </a>
        </div>
      </TableCell>
      <TableCell>
        <a
          href={request.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline truncate block max-w-[200px]"
          title={request.linkUrl}
        >
          {request.linkUrl.length > 40
            ? `${request.linkUrl.substring(0, 40)}...`
            : request.linkUrl}
        </a>
      </TableCell>
      <TableCell>{formatDate(request.startDate)}</TableCell>
      <TableCell>{formatDate(request.endDate)}</TableCell>
      <TableCell>
        {status === "pending" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
            Pending
          </span>
        )}
        {status === "approved" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
            {isActive ? "Active" : isExpired ? "Expired" : "Approved"}
          </span>
        )}
        {status === "declined" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-800">
            Declined
          </span>
        )}
        {status === "deactivated" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
            Deactivated
          </span>
        )}
      </TableCell>
      <TableCell>{formatDate(request.createdAt)}</TableCell>
      {isSuperAdmin && (
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            {isPending ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-rose-600 hover:text-rose-700"
                  disabled={adRequestDecisionId === request._id}
                  onClick={() => onAdRequestDecision(request._id, "decline")}
                >
                  <X className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-emerald-600 hover:text-emerald-700"
                  disabled={adRequestDecisionId === request._id}
                  onClick={() => onAdRequestDecision(request._id, "approve")}
                >
                  <Check className="size-4" />
                </Button>
              </>
            ) : isActive ? (
              <Button
                variant="ghost"
                size="icon"
                className="text-orange-600 hover:text-orange-700"
                disabled={adRequestDecisionId === request._id}
                onClick={() => onDeactivateAd?.(request._id)}
                title="Deactivate ad"
              >
                <PowerOff className="size-4" />
              </Button>
            ) : null}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

