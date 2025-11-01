import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { api, getErr } from "@/lib/api";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { user: currentUser } = useAuth();

  // Fetch all users from the backend
  useEffect(() => {
    let ok = true;

    (async () => {
      try {
        const { data } = await api.get("/api/users");
        if (!ok) return;
        setUsers(data.users ?? data ?? []);
      } catch (e) {
        if (!ok) return;
        const msg = getErr(e);
        setError(msg);
        toast.error(msg);
      } finally {
        if (ok) setLoading(false);
      }
    })();

    return () => {
      ok = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (id === currentUser?._id) {
      toast.error("You cannot delete your own account");
      return;
    }

    const confirmed = window.confirm(
      "Delete this user? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted");
    } catch (e) {
      toast.error(getErr(e));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <Table>
        <TableCaption>Manage user accounts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-6 text-center text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => (
              <TableRow key={user._id || user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "Yes" : "No"}</TableCell>
                <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === user._id}
                    onClick={() => handleDelete(user._id)}
                  >
                    {deletingId === user._id ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Dashboard;
