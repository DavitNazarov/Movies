import { useState, useEffect } from "react";
import { Users, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { UserRow } from "./UserRow";

export function UsersModal({
  currentUser,
  isSuperAdmin,
  decisionUserId,
  updatingStatusId,
  deletingId,
  submittingActionKey,
  hasPendingAction,
  onUserAdminDecision,
  onDirectStatusChange,
  onDelete,
  onSubmitActionRequest,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(
        `/api/users/all${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`
      );
      setUsers(data.users ?? []);
    } catch (err) {
      const msg = getErr(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        loadUsers();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Users className="mr-2 h-4 w-4" />
          View All Users
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>All Users</DialogTitle>
          <DialogDescription>
            Search and manage all user accounts
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchTerm ? "No users found" : "No users"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Request</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <UserRow
                    key={user._id || user.id}
                    user={user}
                    index={index}
                    currentUser={currentUser}
                    isSuperAdmin={isSuperAdmin}
                    decisionUserId={decisionUserId}
                    updatingStatusId={updatingStatusId}
                    deletingId={deletingId}
                    submittingActionKey={submittingActionKey}
                    hasPendingAction={hasPendingAction}
                    onUserAdminDecision={onUserAdminDecision}
                    onDirectStatusChange={onDirectStatusChange}
                    onDelete={onDelete}
                    onSubmitActionRequest={onSubmitActionRequest}
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

