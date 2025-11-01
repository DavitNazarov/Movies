import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { api, getErr } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const initialName = useRef(user?.name ?? "");
  const [name, setName] = useState(initialName.current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      </Card>
    </div>
  );
};

export default ProfilePage;
