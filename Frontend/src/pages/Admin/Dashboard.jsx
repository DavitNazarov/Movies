import { Link } from "react-router-dom";
import { path } from "@/constants/routes.const";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Image } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-4">
        {/* Users Management Box */}
        <Link to={path.dashboardUsers} className="block">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Users Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage users, permissions, and admin requests
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Admin Requests Box */}
        <Link to={path.dashboardAdminRequests} className="block">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Admin Requests</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Review and manage admin action requests
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Ad Requests Box */}
        <Link to={path.dashboardAdRequests} className="block">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Ad Requests</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Review and manage banner ad requests
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
