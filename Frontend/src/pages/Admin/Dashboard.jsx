import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/Table";
import { api, getErr } from "@/lib/api";
import Loading from "@/components/ui/Loading";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users from the backend
  useEffect(() => {
    let ok = true;

    (async () => {
      try {
        const { data } = await api.get("/api/users"); // backend route to get all users
        if (!ok) return;
        setUsers(data.users || data); // adjust depending on backend response
      } catch (e) {
        if (!ok) return;
        setError(getErr(e));
      } finally {
        if (ok) setLoading(false);
      }
    })();

    return () => {
      ok = false;
    };
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Table>
        <TableCaption>All registered users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Verified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user._id || user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.isAdmin ? "Yes" : "No"}</TableCell>
              <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Dashboard;
