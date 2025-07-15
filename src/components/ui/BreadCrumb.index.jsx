import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const BreadCrumb = () => {
  const location = useLocation();

  const [segment1, setSegment1] = useState("Home");
  const [segment2, setSegment2] = useState("");

  useEffect(() => {
    const rawPath = location.pathname;

    const pathSegments = rawPath
      .split("/")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

    setSegment1(pathSegments[0] || "Home");
    setSegment2(pathSegments[1] || "");
  }, [location]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={location.pathname}>{segment1}</BreadcrumbLink>
        </BreadcrumbItem>
        {segment2 && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink href={segment2.toLowerCase()}>
                {segment2}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
