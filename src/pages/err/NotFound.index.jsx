import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { path } from "@/constants/routes.const";
import { AlertCircleIcon } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center">
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription className="flex">
          Hey, page not Found! go to the
          <Link to={path.home} className="font-bold">
            HOME
          </Link>
          page!
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NotFound;
