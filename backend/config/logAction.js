import Log from '../model/Log.js';


/**
 * Logs a system action to MongoDB
 * @param {Object} params
 * @param {String} params.userId - ID of the user performing the action
 * @param {String} params.email - Email of the user
 * @param {String} params.ipAddress - IP address of the user
 * @param {String} params.action - The action performed (UPLOAD, EDIT, DELETE)
 * @param {String} params.contentType - Type of content affected
 * @param {String} params.affectedAsset - Name/ID of the affected asset
 * @param {String} [params.severity] - Severity level (default: info)
 * @param {String} [params.description] - Additional details
 */



export async function logAction({
  action,
  user,
  affectedAsset,
  contentType,
  details
}) {
  try {
    const logEntry = new Log({
      action, 
      user: {
        id: user?.id || "system",
        email: user?.email || "system@localhost",
        ipAddress: user?.ipAddress || "0.0.0.0"
      },
      affectedAsset,
      contentType,
      details
    });

    await logEntry.save();
  } catch (err) {
    console.error("Failed to save log:", err.message);
  }
}

