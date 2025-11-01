import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { fetchMoviesById } from "@/api/tmdb";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const formatSegment = (segment) => {
  if (!segment) return "";
  const withSpaces = segment
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  return withSpaces
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const BreadCrumb = () => {
  const location = useLocation();
  const rawSegments = useMemo(
    () => location.pathname.split("/").filter(Boolean),
    [location.pathname]
  );

  const movieId =
    rawSegments.length >= 2 && rawSegments[0] === "movies"
      ? rawSegments[1]
      : null;

  const titleCacheRef = useRef(new Map());
  const [movieTitle, setMovieTitle] = useState("");

  useEffect(() => {
    if (!movieId) {
      setMovieTitle("");
      return;
    }

    if (titleCacheRef.current.has(movieId)) {
      setMovieTitle(titleCacheRef.current.get(movieId));
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await fetchMoviesById(movieId);
        const label = data?.title || data?.name || `Movie ${movieId}`;
        if (!cancelled) {
          titleCacheRef.current.set(movieId, label);
          setMovieTitle(label);
        }
      } catch (err) {
        if (!cancelled) {
          titleCacheRef.current.delete(movieId);
          setMovieTitle("");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  const crumbs = useMemo(() => {
    if (rawSegments.length === 0) {
      return [{ label: "Home", to: "/", isCurrent: true }];
    }

    const items = [{ label: "Home", to: "/", isCurrent: false }];
    let pathSoFar = "";

    rawSegments.forEach((segment, idx) => {
      pathSoFar += `/${segment}`;
      const isLast = idx === rawSegments.length - 1;
      const decoded = decodeURIComponent(segment);
      let label = formatSegment(decoded);

      if (movieId && idx === 1) {
        label = movieTitle || "Loading...";
      }

      items.push({
        label,
        to: pathSoFar,
        isCurrent: isLast,
      });
    });

    items[items.length - 1].isCurrent = true;
    return items;
  }, [rawSegments, movieId, movieTitle]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, idx) => (
          <Fragment key={crumb.to || idx}>
            <BreadcrumbItem
              className={idx === 0 ? "hidden md:inline-flex" : undefined}
            >
              {crumb.isCurrent ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.to}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {idx < crumbs.length - 1 && (
              <BreadcrumbSeparator className="hidden md:flex" />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
