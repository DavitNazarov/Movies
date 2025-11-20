// Ad Banner Component
// Displays active ads between movie sections
// Shows ads that are approved and within their date range
// Shows countdown/upcoming info if another user's ad is scheduled
import { useEffect, useState } from "react";
import { api, getErr } from "@/lib/api";
import { Clock, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to ensure image URL points to backend
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  // If it's already a full URL, use it as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  // If it's a relative path starting with /uploads, use it as is (will be proxied in dev)
  if (imageUrl.startsWith("/uploads")) {
    return imageUrl;
  }
  // Otherwise, assume it's a relative path and prepend /uploads
  return `/uploads/${imageUrl}`;
};

export function AdBanner() {
  const [activeAds, setActiveAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/api/ad-requests/active");
        if (!active) return;
        console.log("Active ads received:", data.ads);
        if (data.ads && data.ads.length > 0) {
          console.log("First ad imageUrl:", data.ads[0].imageUrl);
        }
        setActiveAds(data.ads || []);
      } catch (err) {
        if (!active) return;
        const msg = getErr(err);
        setError(msg);
        // Don't show error toast for ads - it's not critical
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return null; // Don't show loading state for ads
  }

  if (error) {
    console.error("Ad banner error:", error);
    return null; // Don't show anything on error
  }

  if (activeAds.length === 0) {
    return null; // Don't show anything if no ads
  }

  // Show the first active ad (sorted by start date)
  const currentAd = activeAds[0];
  if (!currentAd) return null;
  
  // Ensure imageUrl exists
  if (!currentAd.imageUrl) {
    console.warn("Ad has no imageUrl:", currentAd);
    return null;
  }
  
  const now = new Date();
  const endDate = new Date(currentAd.endDate);
  const timeRemaining = endDate - now;
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  // Check if there's an upcoming ad
  const upcomingAd = activeAds.length > 1 ? activeAds[1] : null;
  const upcomingStartDate = upcomingAd ? new Date(upcomingAd.startDate) : null;
  const timeUntilUpcoming = upcomingStartDate ? upcomingStartDate - now : null;
  const hoursUntilUpcoming = timeUntilUpcoming
    ? Math.floor(timeUntilUpcoming / (1000 * 60 * 60))
    : null;

  return (
    <section className="w-full py-4">
      <div className="movie-row__container">
        <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 shadow-sm">
          {/* Current Ad - clickable banner */}
          <div className="relative overflow-hidden">
            <a
              href={currentAd.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <img
                src={getImageUrl(currentAd.imageUrl)}
                alt={`Ad by ${currentAd.requester?.name || "User"}`}
                className="w-full object-contain object-center"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  imageRendering: 'auto',
                  filter: 'brightness(1.02) contrast(1.05) saturate(1.1)',
                  maxHeight: '200px',
                  minHeight: '100px',
                  display: 'block',
                }}
                loading="lazy"
                onError={(e) => {
                  // Log error for debugging
                  console.error("Failed to load ad image:", currentAd.imageUrl, e);
                  // Show placeholder instead of hiding
                  e.target.style.display = "block";
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23e5e7eb' width='400' height='200'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not available%3C/text%3E%3C/svg%3E";
                }}
                onLoad={() => {
                  console.log("Ad image loaded successfully:", currentAd.imageUrl);
                }}
              />
            </a>
            {/* Ad Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3 pointer-events-none">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="size-3" />
                  <span className="text-[10px] sm:text-xs">
                    {currentAd.requester?.name || "User"}'s ad
                  </span>
                </div>
                {hoursRemaining > 0 && (
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                    <Clock className="size-2.5" />
                    <span>
                      {hoursRemaining > 24
                        ? `${Math.floor(hoursRemaining / 24)} days left`
                        : `${hoursRemaining}h ${minutesRemaining}m left`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Ad Notice */}
          {upcomingAd && hoursUntilUpcoming !== null && hoursUntilUpcoming > 0 && (
            <div className="border-t border-zinc-200 bg-zinc-50/50 px-3 py-1.5">
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-600">
                <span>
                  {upcomingAd.requester?.name || "User"}'s ad starts in{" "}
                  {hoursUntilUpcoming > 24
                    ? `${Math.floor(hoursUntilUpcoming / 24)} days`
                    : `${hoursUntilUpcoming} hours`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

