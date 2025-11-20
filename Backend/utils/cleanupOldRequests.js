// Cleanup job to delete requests older than 30 days
// Runs daily to clean up old admin requests and ad requests
import { AdminActionRequest } from "../model/AdminActionRequest.model.js";
import { AdRequest } from "../model/AdRequest.model.js";

export const cleanupOldRequests = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Delete admin requests older than 30 days
    const adminResult = await AdminActionRequest.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
    });

    // Delete ad requests older than 30 days
    const adResult = await AdRequest.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
    });

    console.log(
      `Cleanup completed: Deleted ${adminResult.deletedCount} admin requests and ${adResult.deletedCount} ad requests older than 30 days`
    );
  } catch (err) {
    console.error("Error during cleanup:", err);
  }
};

// Run cleanup daily
export const startCleanupScheduler = () => {
  // Run immediately on startup
  cleanupOldRequests();

  // Then run every 24 hours
  setInterval(() => {
    cleanupOldRequests();
  }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
};

