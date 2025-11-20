import { BellRing, Clock } from "lucide-react";

export function DashboardHeader({
  pendingUserRequests,
  pendingAdminActionRequests,
  isSuperAdmin,
}) {
  return (
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
  );
}

