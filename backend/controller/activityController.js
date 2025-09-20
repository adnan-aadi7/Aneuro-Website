import PromptPack from "../model/Promptpack.js";
import EmailSequence from "../model/EmailSequence.js";
import FunnelTemplate from "../model/FunnelTemplate.js";

const formatTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);

  if (diffMs < 0) return "just now"; // safety: future creation date

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

export const getRecentActivities = async (req, res) => {
  try {
    const promptPacks = await PromptPack.find()
      .select("name status createdDate")
      .lean();
    const emailSequences = await EmailSequence.find()
      .select("name status createdAt")
      .lean();
    const funnelTemplates = await FunnelTemplate.find()
      .select("name status createdAt")
      .lean();

    const formattedData = [
      ...promptPacks.map((item) => ({
        type: "PromptPack",
        name: item.name,
        status: item.status === "scheduled" ? "Scheduled" : "New",
        action: `${item.name} is ${
          item.status === "scheduled" ? "scheduled" : "uploaded"
        }`,
        date: item.createdDate, // ✅ only creation time
        timeAgo: formatTimeAgo(item.createdDate),
      })),
      ...emailSequences.map((item) => ({
        type: "EmailSequence",
        name: item.name,
        status: item.status === "scheduled" ? "Scheduled" : "New",
        action: `${item.name} is ${
          item.status === "scheduled" ? "scheduled" : "uploaded"
        }`,
        date: item.createdAt, // ✅ only creation time
        timeAgo: formatTimeAgo(item.createdAt),
      })),
      ...funnelTemplates.map((item) => ({
        type: "FunnelTemplate",
        name: item.name,
        status: item.status === "scheduled" ? "Scheduled" : "New",
        action: `${item.name} is ${
          item.status === "scheduled" ? "scheduled" : "uploaded"
        }`,
        date: item.createdAt, // ✅ only creation time
        timeAgo: formatTimeAgo(item.createdAt),
      })),
    ];

    // ✅ Sort latest first
    formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      activities: formattedData,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
