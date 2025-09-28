import EmailSequence from "../model/EmailSequence.js";
import FunnelTemplate from "../model/FunnelTemplate.js";
import PromptPack from "../model/Promptpack.js";

export const getWeeklyTools = async (req, res) => {
  try {
    // 📅 Get start of current week (Monday 00:00)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    const day = startOfWeek.getDay(); // 0 = Sunday, 1 = Monday...
    const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    // End of week (Sunday 23:59:59)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    // 🔎 Query counts for each type
    const [emailCount, funnelCount, promptCount] = await Promise.all([
      EmailSequence.countDocuments({
        createdAt: { $gte: startOfWeek, $lt: endOfWeek },
      }),
      FunnelTemplate.countDocuments({
        createdAt: { $gte: startOfWeek, $lt: endOfWeek },
      }),
      PromptPack.countDocuments({
        createdDate: { $gte: startOfWeek, $lt: endOfWeek },
      }),
    ]);

    res.status(200).json({
      success: true,
      weekRange: {
        start: startOfWeek,
        end: endOfWeek,
      },
      data: {
        emailSequences: emailCount,
        funnelTemplates: funnelCount,
        promptPacks: promptCount,
        total: emailCount + funnelCount + promptCount,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching weekly tools:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching weekly tools",
      error: error.message,
    });
  }
};
