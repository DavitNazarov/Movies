import { Link } from "react-router-dom";
import { path } from "@/constants/routes.const";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, Image } from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-4">
        {/* Change Name Box */}
        <Link to={path.changeName} className="block">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Change Name</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your display name
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Change Password Box */}
        <Link to={path.changePassword} className="block">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Change Password</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your account password
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Ad Request Box */}
        <Link to={path.adRequest} className="block">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Submit Ad Request</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Submit a banner ad for your content
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
