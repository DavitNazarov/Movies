import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { path } from "@/constants/routes.const";
import { AlertCircleIcon } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full px-4">
      <Alert
        variant="destructive"
        className="flex flex-col justify-center items-center w-full max-w-3xl text-center gap-2"
      >
        <AlertCircleIcon className="w-6 h-6" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Hey, page not found! Go to the{" "}
          <Link to={path.home} className="font-bold underline text-primary">
            HOME
          </Link>{" "}
          page!
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NotFound;
