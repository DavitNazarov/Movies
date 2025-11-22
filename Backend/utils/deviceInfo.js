/**
 * Utility functions for extracting device information and location
 */

/**
 * Parse User-Agent string to extract device information
 * @param {string} userAgent - User-Agent header from request
 * @returns {object} Device information
 */
export function parseDeviceInfo(userAgent = "") {
  if (!userAgent) {
    return {
      browser: "Unknown",
      os: "Unknown",
      device: "Unknown",
    };
  }

  const ua = userAgent.toLowerCase();

  // Browser detection
  let browser = "Unknown";
  if (ua.includes("chrome") && !ua.includes("edg")) {
    browser = "Chrome";
  } else if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "Safari";
  } else if (ua.includes("edg")) {
    browser = "Edge";
  } else if (ua.includes("opera") || ua.includes("opr")) {
    browser = "Opera";
  }

  // OS detection
  let os = "Unknown";
  if (ua.includes("windows")) {
    os = "Windows";
  } else if (ua.includes("mac")) {
    os = "macOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  } else if (ua.includes("android")) {
    os = "Android";
  } else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) {
    os = "iOS";
  }

  // Device type
  let device = "Desktop";
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    device = "Mobile";
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    device = "Tablet";
  }

  return {
    browser,
    os,
    device,
    userAgent: userAgent.substring(0, 100), // Limit length
  };
}

/**
 * Get location from IP address using free IP geolocation service
 * @param {string} ip - IP address
 * @returns {Promise<object>} Location information (city, country)
 */
export async function getLocationFromIP(ip) {
  // Handle localhost/development IPs
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return {
      city: "Local",
      country: "Development",
    };
  }

  try {
    // Using ip-api.com (free, no API key required, 45 requests/minute)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,city,country,countryCode`);
    const data = await response.json();

    if (data.status === "success") {
      return {
        city: data.city || "Unknown",
        country: data.country || "Unknown",
        countryCode: data.countryCode || "",
      };
    }

    return {
      city: "Unknown",
      country: "Unknown",
    };
  } catch (error) {
    console.error("Failed to get location from IP:", error);
    return {
      city: "Unknown",
      country: "Unknown",
    };
  }
}

/**
 * Extract IP address from request
 * @param {object} req - Express request object
 * @returns {string} IP address
 */
export function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "Unknown"
  );
}

