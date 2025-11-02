import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { api, getErr } from "@/lib/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { user, setUser, refreshMe } = useAuth();
  const initialName = useRef(user?.name ?? "");
  const [name, setName] = useState(initialName.current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const statusRef = useRef(user?.adminRequestStatus ?? "none");

  useEffect(() => {
    initialName.current = user?.name ?? "";
    setName(initialName.current);
  }, [user?.name]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const { data } = await api.patch("/api/users/me", { name: trimmed });
      if (data?.user) {
        setUser(data.user);
        toast.success("Name updated");
      }
    } catch (err) {
      const msg = getErr(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const isNameDirty = useMemo(
    () => name.trim() !== (user?.name ?? ""),
    [name, user?.name]
  );

  const adminRequestStatus = user?.adminRequestStatus ?? "none";
  const isAdmin = Boolean(user?.isAdmin);
  const requestPending = adminRequestStatus === "pending";

  useEffect(() => {
    if (statusRef.current === "pending" && adminRequestStatus !== "pending") {
      if (adminRequestStatus === "approved") {
        toast.success("Your admin request has been approved");
      } else if (adminRequestStatus === "declined") {
        toast.error("Your admin request has been declined");
      }
    }
    statusRef.current = adminRequestStatus;
  }, [adminRequestStatus]);

  useEffect(() => {
    if (!requestPending) return;

    const interval = setInterval(() => {
      refreshMe().catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [requestPending, refreshMe]);

  const handleAdminRequest = async () => {
    try {
      const { data } = await api.post("/api/users/me/admin-request");
      if (data?.user) {
        setUser(data.user);
      }
      toast.success("Request sent to admins");
    } catch (err) {
      toast.error(getErr(err));
    }
  };

  const renderStatusMessage = () => {
    switch (adminRequestStatus) {
      case "pending":
        return "Your request to become an admin is awaiting review.";
      case "approved":
        return "You now have admin access.";
      case "declined":
        return "Your request was declined.";
      default:
        return "";
    }
  };

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Change Name</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="profile-name">
                Name
              </label>
              <Input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter new name"
                aria-invalid={Boolean(error)}
                disabled={saving}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={saving || !isNameDirty}
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {!isAdmin && (
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
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
