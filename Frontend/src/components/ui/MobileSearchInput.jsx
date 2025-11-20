// Mobile search input component - shown only on mobile devices
// Used in the main page after welcome section
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./input";
import { path } from "@/constants/routes.const";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileSearchInput() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `${path.search}?q=${encodeURIComponent(q)}` : path.search);
  };

  // Only render on mobile
  if (!isMobile) return null;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Input
        placeholder="Search Movie..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full"
      />
    </form>
  );
}

