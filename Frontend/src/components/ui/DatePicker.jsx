import { useState, useRef, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export function DatePicker({
  value,
  onChange,
  unavailableRanges = [],
  min,
  max,
  disabled,
  id,
  label,
  placeholder = "Select date and time",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || "");
  const [selectedTime, setSelectedTime] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (value) {
      // Handle both ISO format and datetime-local format
      let date;
      if (
        value.includes("T") &&
        !value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
      ) {
        // ISO format or datetime with timezone
        date = new Date(value);
      } else if (
        value.includes("T") &&
        value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
      ) {
        // datetime-local format (YYYY-MM-DDTHH:mm) - parse as local time
        const [datePart, timePart] = value.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);
        date = new Date(year, month - 1, day, hours || 0, minutes || 0, 0, 0);
      } else {
        date = new Date(value);
      }

      if (!isNaN(date.getTime())) {
        setSelectedDate(date.toISOString().slice(0, 10));
        setSelectedTime(
          `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
          ).padStart(2, "0")}`
        );
      }
    } else {
      setSelectedDate("");
      setSelectedTime("");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Check if a specific datetime is unavailable
  const isDateTimeUnavailable = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return false;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const checkDateTime = new Date(dateStr);
    checkDateTime.setHours(hours, minutes, 0, 0);

    return unavailableRanges.some((range) => {
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);
      return checkDateTime >= rangeStart && checkDateTime <= rangeEnd;
    });
  };

  // Check if a day has any unavailable time slots
  const dayHasUnavailableTimes = (dateStr) => {
    if (!dateStr) return false;
    const checkDate = new Date(dateStr);
    checkDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(checkDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return unavailableRanges.some((range) => {
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);
      // Check if range overlaps with this day
      return rangeStart < nextDay && rangeEnd >= checkDate;
    });
  };

  // Get unavailable time ranges for a specific day
  const getUnavailableTimeRangesForDay = (dateStr) => {
    if (!dateStr) return [];
    const checkDate = new Date(dateStr);
    checkDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(checkDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const ranges = [];
    unavailableRanges.forEach((range) => {
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);

      // Check if range overlaps with this day
      if (rangeStart < nextDay && rangeEnd >= checkDate) {
        const dayStart = rangeStart < checkDate ? checkDate : rangeStart;
        const dayEnd = rangeEnd >= nextDay ? nextDay : rangeEnd;
        ranges.push({
          start: dayStart,
          end: dayEnd,
        });
      }
    });

    return ranges;
  };

  const isDateDisabled = (dateStr) => {
    if (!dateStr) return true;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (min) {
      const minDate = new Date(min);
      minDate.setHours(0, 0, 0, 0);
      if (date < minDate) return true;
    } else if (date < today) {
      return true;
    }

    if (max) {
      const maxDate = new Date(max);
      maxDate.setHours(0, 0, 0, 0);
      if (date > maxDate) return true;
    }

    // Don't disable days - only disable if entire day is in the past
    return false;
  };

  // Convert local datetime string to ISO format for backend
  // dateStr is in YYYY-MM-DD format (local date)
  // timeStr is in HH:mm format (local time)
  const convertToISO = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hours, minutes] = timeStr.split(":").map(Number);
    // Create date in local timezone, then convert to ISO
    const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return localDate.toISOString();
  };

  const handleDateSelect = (dateStr) => {
    if (isDateDisabled(dateStr)) return;

    setSelectedDate(dateStr);
    // If no time selected yet, set default to 00:00
    const time = selectedTime || "00:00";
    const datetime = `${dateStr}T${time}`;

    // Check if this datetime is unavailable
    if (isDateTimeUnavailable(dateStr, time)) {
      // Don't update if the selected time is unavailable
      // User needs to select a different time
      return;
    }

    // Convert to ISO format for backend
    const isoValue = convertToISO(dateStr, time);
    onChange({ target: { value: isoValue } });
  };

  const handleTimeChange = (time) => {
    if (!selectedDate) {
      // Can't set time without a date
      return;
    }

    // Check if this specific datetime is unavailable
    if (isDateTimeUnavailable(selectedDate, time)) {
      // Don't allow selecting unavailable time
      return;
    }

    setSelectedTime(time);
    // Convert to ISO format for backend
    const isoValue = convertToISO(selectedDate, time);
    onChange({ target: { value: isoValue } });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setSelectedDate("");
      setSelectedTime("");
      onChange(e);
      return;
    }

    // Parse the value - handle both ISO and datetime-local format
    let date;
    if (value.includes("T") && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
      // datetime-local format (YYYY-MM-DDTHH:mm) - parse as local time
      const [datePart, timePart] = value.split("T");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hours, minutes] = timePart.split(":").map(Number);
      date = new Date(year, month - 1, day, hours || 0, minutes || 0, 0, 0);
    } else {
      // ISO format or other - parse normally
      date = new Date(value);
    }

    if (isNaN(date.getTime())) return;

    const dateStr = date.toISOString().slice(0, 10);
    const timeStr = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;

    // Check if the datetime is unavailable
    if (isDateTimeUnavailable(dateStr, timeStr)) {
      // DateTime is unavailable, don't update
      return;
    }

    setSelectedDate(dateStr);
    setSelectedTime(timeStr);
    // Convert to ISO format for backend
    const isoValue = convertToISO(dateStr, timeStr);
    if (isoValue) {
      onChange({ target: { value: isoValue } });
    }
  };

  // Helper to format date as YYYY-MM-DD in local timezone
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const generateCalendarDays = () => {
    // Get today's date in local timezone
    const now = new Date();
    const todayLocal = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const todayStr = formatLocalDate(todayLocal);

    const currentMonth = selectedDate
      ? new Date(selectedDate + "T00:00:00")
      : new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      const dateStr = formatLocalDate(date);
      days.push({
        date: dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isDisabled: isDateDisabled(dateStr),
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatLocalDate(date);
      const isToday = dateStr === todayStr;
      days.push({
        date: dateStr,
        day,
        isCurrentMonth: true,
        isToday,
        isDisabled: isDateDisabled(dateStr),
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateStr = formatLocalDate(date);
      days.push({
        date: dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isDisabled: isDateDisabled(dateStr),
      });
    }

    return days;
  };

  const displayValue = value
    ? new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          className="cursor-pointer"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white p-4 shadow-lg">
          <div className="space-y-4">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-xs font-semibold text-gray-500"
                >
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((dayObj, idx) => {
                const hasUnavailableTimes = dayHasUnavailableTimes(dayObj.date);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDateSelect(dayObj.date)}
                    disabled={dayObj.isDisabled}
                    className={cn(
                      "h-8 rounded text-sm transition-colors relative",
                      dayObj.isCurrentMonth ? "text-gray-900" : "text-gray-400",
                      dayObj.isToday && "bg-blue-100 font-semibold",
                      hasUnavailableTimes &&
                        "bg-amber-50 border border-amber-200",
                      dayObj.isDisabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-gray-100 cursor-pointer",
                      selectedDate === dayObj.date &&
                        "bg-blue-500 text-white hover:bg-blue-600"
                    )}
                    title={
                      hasUnavailableTimes
                        ? "This day has some unavailable time slots"
                        : ""
                    }
                  >
                    {dayObj.day || new Date(dayObj.date).getDate()}
                    {hasUnavailableTimes && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Time Picker */}
            <div className="border-t pt-4">
              <label className="mb-2 block text-sm font-medium">Time</label>
              {selectedDate ? (
                <>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className={cn(
                      "w-full",
                      selectedTime &&
                        isDateTimeUnavailable(selectedDate, selectedTime) &&
                        "border-red-500 bg-red-50"
                    )}
                  />
                  {selectedDate && (
                    <div className="mt-2 space-y-1">
                      {getUnavailableTimeRangesForDay(selectedDate).length >
                        0 && (
                        <div className="text-xs text-amber-600">
                          <p className="font-semibold mb-1">
                            Unavailable time slots for this day:
                          </p>
                          {getUnavailableTimeRangesForDay(selectedDate).map(
                            (range, idx) => {
                              const startTime = new Date(
                                range.start
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                              const endTime = new Date(
                                range.end
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                              return (
                                <p key={idx} className="text-red-600">
                                  {startTime} - {endTime}
                                </p>
                              );
                            }
                          )}
                        </div>
                      )}
                      {selectedTime &&
                        isDateTimeUnavailable(selectedDate, selectedTime) && (
                          <p className="text-xs text-red-600 font-semibold">
                            ⚠ This time slot is unavailable. Please choose a
                            different time.
                          </p>
                        )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-500">
                  Please select a date first
                </p>
              )}
            </div>

            {/* Close Button */}
            <div className="flex justify-end border-t pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
