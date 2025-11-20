import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { api, getErr } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function AdminRequestButton() {
  const { user, setUser } = useAuth();
  const statusRef = useRef(user?.adminRequestStatus ?? "none");
  const [requestPending, setRequestPending] = useState(
    user?.adminRequestStatus === "pending"
  );

  const isAdmin = Boolean(user?.isAdmin);
  const adminRequestStatus = user?.adminRequestStatus ?? "none";

  const handleAdminRequest = async () => {
    if (requestPending) return;
    setRequestPending(true);
    try {
      await api.post("/api/users/me/admin-request");
      toast.success("Admin request sent");
      setUser((prev) =>
        prev
          ? {
              ...prev,
              adminRequestStatus: "pending",
            }
          : prev
      );
    } catch (err) {
      const msg = getErr(err);
      toast.error(msg);
      setRequestPending(false);
    }
  };

  const renderStatusMessage = () => {
    if (adminRequestStatus === "pending") {
      return "Your admin request is pending review.";
    }
    if (adminRequestStatus === "approved") {
      return "Your admin request has been approved!";
    }
    if (adminRequestStatus === "declined") {
      return "Your admin request was declined.";
    }
    return null;
  };

  if (isAdmin) return null;

  return (
    <>
      {adminRequestStatus !== "approved" && (
        <Button
          variant="outline"
          className="w-full"
          disabled={requestPending}
          onClick={handleAdminRequest}
        >
          {requestPending ? "Request Pending" : "Become Admin"}
        </Button>
      )}
      {renderStatusMessage() && (
        <p className="text-sm text-muted-foreground text-center">
          {renderStatusMessage()}
        </p>
      )}
    </>
  );
}

