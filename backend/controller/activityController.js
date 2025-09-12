import PromptPack from "../model/Promptpack.js";
import EmailSequence from "../model/EmailSequence.js";
import FunnelTemplate from "../model/FunnelTemplate.js";


export const getRecentActivities = async (req, res) => {
  try {
    const promptPacks = await PromptPack.find().select("name status createdDate releaseDateTime").lean();
    const emailSequences = await EmailSequence.find().select("name status createdAt releaseDateTime").lean();
    const funnelTemplates = await FunnelTemplate.find().select("name status createdAt releaseDateTime").lean();

    // Format results
    const formattedData = [
      ...promptPacks.map(item => ({
        type: "PromptPack",
        name: item.name,
        status: item.status === "scheduled" ? "Scheduled" : "New",
        action: `${item.name} is ${item.status === "scheduled" ? "scheduled" : "uploaded"}`,
        date: item.releaseDateTime || item.createdDate
      })),
      ...emailSequences.map(item => ({
        type: "EmailSequence",
        name: item.name,
        status: item.status === "scheduled" ? "Scheduled" : "New",
        action: `${item.name} is ${item.status === "scheduled" ? "scheduled" : "uploaded"}`,
        date: item.releaseDateTime || item.createdAt
      })),
      ...funnelTemplates.map(item => ({
        type: "FunnelTemplate",
        name: item.name,
        status: item.status === "scheduled" ? "Scheduled" : "New",
        action: `${item.name} is ${item.status === "scheduled" ? "scheduled" : "uploaded"}`,
        date: item.releaseDateTime || item.createdAt
      })),
    ];

    // Sort by most recent
    formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      activities: formattedData
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
