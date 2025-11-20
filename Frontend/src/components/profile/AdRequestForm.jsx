import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api, getErr } from "@/lib/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, AlertTriangle } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";

export function AdRequestForm() {
  const [adImageUrl, setAdImageUrl] = useState("");
  const [adImageFile, setAdImageFile] = useState(null);
  const [adImagePreview, setAdImagePreview] = useState("");
  const [adLinkUrl, setAdLinkUrl] = useState("");
  const [adStartDate, setAdStartDate] = useState("");
  const [adEndDate, setAdEndDate] = useState("");
  const [submittingAd, setSubmittingAd] = useState(false);
  const [adError, setAdError] = useState("");
  const [unavailableRanges, setUnavailableRanges] = useState([]);

  // Fetch unavailable date ranges
  const fetchUnavailableDates = async () => {
    try {
      const { data } = await api.get("/api/ad-requests/unavailable-dates");
      if (data?.success && data?.unavailableRanges) {
        setUnavailableRanges(data.unavailableRanges);
      }
    } catch (err) {
      // Silently fail - validation will catch it on submit
      console.error("Failed to load unavailable dates:", err);
    }
  };

  useEffect(() => {
    fetchUnavailableDates();
    // Refresh every 10 seconds to get updated unavailable ranges after deactivation
    const interval = setInterval(fetchUnavailableDates, 10000);
    return () => clearInterval(interval);
  }, []);

  // Check if a date range overlaps with unavailable ranges
  const isDateRangeUnavailable = (start, end) => {
    if (!start || !end) return false;
    const startDate = new Date(start);
    const endDate = new Date(end);

    return unavailableRanges.some((range) => {
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);

      // Check for overlap
      return (
        (startDate >= rangeStart && startDate <= rangeEnd) ||
        (endDate >= rangeStart && endDate <= rangeEnd) ||
        (startDate <= rangeStart && endDate >= rangeEnd)
      );
    });
  };

  // Validate date selection
  const validateDateSelection = (start, end) => {
    if (!start || !end) return null;

    if (isDateRangeUnavailable(start, end)) {
      return "Please choose a different date range. Other ad is active at this time.";
    }

    // Parse dates - handle both ISO format and datetime-local format
    let startDate, endDate;
    try {
      // If it's ISO format (has Z or timezone), parse directly
      if (start.includes("T") && (start.includes("Z") || start.includes("+") || start.includes("-") && start.match(/\d{2}:\d{2}:\d{2}/))) {
        startDate = new Date(start);
      } else if (start.includes("T")) {
        // datetime-local format (YYYY-MM-DDTHH:mm) - parse as local time
        const [datePart, timePart] = start.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);
        startDate = new Date(year, month - 1, day, hours || 0, minutes || 0, 0, 0);
      } else {
        startDate = new Date(start);
      }

      if (end.includes("T") && (end.includes("Z") || end.includes("+") || end.includes("-") && end.match(/\d{2}:\d{2}:\d{2}/))) {
        endDate = new Date(end);
      } else if (end.includes("T")) {
        const [datePart, timePart] = end.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);
        endDate = new Date(year, month - 1, day, hours || 0, minutes || 0, 0, 0);
      } else {
        endDate = new Date(end);
      }
    } catch (err) {
      return "Invalid date format";
    }

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return "Invalid date format";
    }

    const now = new Date();
    
    // Allow 24-hour buffer to account for timezone differences
    // This ensures users can select times for today regardless of timezone
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (startDate < oneDayAgo) {
      return "Start date cannot be in the past";
    }

    if (endDate <= startDate) {
      return "End date must be after start date";
    }

    return null;
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setAdError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setAdError("Image file size must be less than 5MB");
        return;
      }
      setAdImageFile(file);
      setAdImageUrl("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    setAdImageUrl(e.target.value);
    if (e.target.value.trim()) {
      setAdImageFile(null);
      setAdImagePreview("");
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setAdStartDate(newStartDate);
    setAdError("");

    // Validate if end date is already set
    if (adEndDate) {
      const error = validateDateSelection(newStartDate, adEndDate);
      if (error) {
        setAdError(error);
      }
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setAdEndDate(newEndDate);
    setAdError("");

    // Validate if start date is already set
    if (adStartDate) {
      const error = validateDateSelection(adStartDate, newEndDate);
      if (error) {
        setAdError(error);
      }
    }
  };

  const handleAdRequest = async (e) => {
    e.preventDefault();
    setAdError("");

    if (!adImageUrl.trim() && !adImageFile) {
      setAdError("Either Image URL or Image File upload is required");
      return;
    }

    if (!adLinkUrl.trim()) {
      setAdError("Link URL is required");
      return;
    }

    if (!adStartDate || !adEndDate) {
      setAdError("Start date and end date are required");
      return;
    }

    // Refresh unavailable ranges before validation to get latest data (after deactivation)
    await fetchUnavailableDates();

    // Validate date range
    const dateError = validateDateSelection(adStartDate, adEndDate);
    if (dateError) {
      setAdError(dateError);
      return;
    }

    setSubmittingAd(true);
    try {
      if (adImageFile) {
        const formData = new FormData();
        formData.append("imageFile", adImageFile);
        formData.append("linkUrl", adLinkUrl.trim());
        formData.append("startDate", adStartDate);
        formData.append("endDate", adEndDate);

        await api.post("/api/ad-requests", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/api/ad-requests", {
          imageUrl: adImageUrl.trim(),
          linkUrl: adLinkUrl.trim(),
          startDate: adStartDate,
          endDate: adEndDate,
        });
      }

      toast.success("Ad request submitted successfully");
      setAdImageUrl("");
      setAdImageFile(null);
      setAdImagePreview("");
      setAdLinkUrl("");
      setAdStartDate("");
      setAdEndDate("");
    } catch (err) {
      const msg = getErr(err);
      setAdError(msg);
      toast.error(msg);
    } finally {
      setSubmittingAd(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <ImageIcon className="size-5" />
          Request Ad Banner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAdRequest} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="ad-image-url">
              Image URL (Optional if uploading file)
            </Label>
            <Input
              id="ad-image-url"
              type="url"
              value={adImageUrl}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
              disabled={submittingAd || adImageFile}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ad-image-file">Or Upload Image File</Label>
            <Input
              id="ad-image-file"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              disabled={submittingAd || adImageUrl.trim()}
            />
            {adImagePreview && (
              <div className="mt-2">
                <img
                  src={adImagePreview}
                  alt="Preview"
                  className="max-h-32 rounded border border-zinc-200"
                />
              </div>
            )}
            {adImageFile && (
              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-amber-800">
                      Warning: File Upload Limitations
                    </p>
                    <p className="text-xs text-amber-700">
                      Uploaded files may not persist in production environments.
                      Files can be lost when the server restarts.{" "}
                      <strong>We recommend using an Image URL instead</strong>{" "}
                      (e.g., from Unsplash, Imgur, or other image hosting
                      services) for reliable ad display.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {adImageFile
                ? `Selected: ${adImageFile.name} (${(adImageFile.size / 1024 / 1024).toFixed(2)} MB)`
                : "Upload an image file (max 5MB) or provide an image URL above."}
              <br />
              <strong>Recommended:</strong> Use a horizontal/landscape image
              with width of at least 1200px for best display.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ad-link-url">Link URL</Label>
            <Input
              id="ad-link-url"
              type="url"
              value={adLinkUrl}
              onChange={(e) => setAdLinkUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={submittingAd}
            />
            <p className="text-xs text-muted-foreground">
              Enter the website URL where users will be redirected when they
              click on the banner
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ad-start-date">Start Date</Label>
              <DatePicker
                id="ad-start-date"
                value={adStartDate}
                onChange={handleStartDateChange}
                disabled={submittingAd}
                unavailableRanges={unavailableRanges}
                min={new Date().toISOString().slice(0, 16)}
                placeholder="Select start date and time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad-end-date">End Date</Label>
              <DatePicker
                id="ad-end-date"
                value={adEndDate}
                onChange={handleEndDateChange}
                disabled={submittingAd}
                unavailableRanges={unavailableRanges}
                min={adStartDate || new Date().toISOString().slice(0, 16)}
                placeholder="Select end date and time"
              />
            </div>
          </div>

          {adError && <p className="text-sm text-destructive">{adError}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={
              submittingAd ||
              (!adImageUrl.trim() && !adImageFile) ||
              !adLinkUrl.trim() ||
              !adStartDate ||
              !adEndDate
            }
          >
            {submittingAd ? "Submitting..." : "Submit Ad Request"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center">
          Your ad request will be reviewed by the super admin. Once approved,
          your ad will appear in the banner sections between movie rows.
        </p>
      </CardFooter>
    </Card>
  );
}

