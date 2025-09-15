import EmailSequence from '../model/EmailSequence.js';
import FunnelTemplate from '../model/FunnelTemplate.js';
import PromptPack from '../model/Promptpack.js';
import Notification from '../model/Notification.js';

export const updateStatuses = async () => {
  const now = new Date();
  const models = [EmailSequence, PromptPack, FunnelTemplate];

  for (const Model of models) {
    // Find scheduled docs
    const docs = await Model.find({ status: "scheduled" });
    console.log(` ${Model.modelName}: found ${docs.length} scheduled docs at ${now.toISOString()}`);

    for (const doc of docs) {
      console.log(`-- ${doc._id} | release=${doc.releaseDateTime?.toISOString()} | status=${doc.status}`);

      // Check if it should be activated
      if (doc.releaseDateTime && doc.releaseDateTime <= now) {
        doc.status = "active";
        await doc.save();

        console.log(`✅ ${Model.modelName} ${doc._id} is now active`);

        // Create notification
        const notification = new Notification({
          title: ` ${doc.name || doc.title || 'Untitled'}`,
          message: `A new ${doc.tier || 'all'} tier ${Model.modelName} has been activated${doc.category ? ` in category: ${doc.category}` : ''}`,
          type: 'newtool',
          isPublic: true,
          targetTier: doc.tier || 'all',
        });

        await notification.save();
        console.log(`🔔 Notification created for ${Model.modelName} ${doc._id}`);
      }
    }
  }
};


export const getAllScheduled = async (req, res) => {
  try {
    await updateStatuses();

    const [emails, prompts, funnels] = await Promise.all([
      EmailSequence.find({ status: 'scheduled', releaseDateTime: { $ne: null } }).lean(),
      PromptPack.find({ status: 'scheduled', releaseDateTime: { $ne: null } }).lean(),
      FunnelTemplate.find({ status: 'scheduled', releaseDateTime: { $ne: null } }).lean(),
    ]);

    const combined = [
      ...emails.map(e => ({
        id: e._id,
        content: e.name,
        type: 'Email Sequence',
        scheduledDate: e.scheduledDate,
        time: e.scheduledTime,
        releaseDateTime: e.releaseDateTime,
        tier: e.tier,
        status: e.status
      })),
      ...prompts.map(p => ({
        id: p._id,
        content: p.name,
        type: 'Prompt Pack',
        scheduledDate: p.scheduledDate,
        time: p.scheduledTime,
        releaseDateTime: p.releaseDateTime,
        tier: p.tier,
        status: p.status
      })),
      ...funnels.map(f => ({
        id: f._id,
        content: f.name,
        type: 'Funnel Template',
        scheduledDate: f.scheduledDate,
        time: f.scheduledTime,
        releaseDateTime: f.releaseDateTime,
        tier: f.tier,
        status: f.status
      }))
    ];

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const totalPending = combined.length;
    const totalPrompts = prompts.length;
    const totalEmails = emails.length;
    const totalFunnels = funnels.length;

    const thisWeekReleases = combined.filter(item =>
      item.releaseDateTime &&
      new Date(item.releaseDateTime) >= startOfWeek &&
      new Date(item.releaseDateTime) <= endOfWeek
    ).length;

    const nextRelease = combined
      .filter(item => item.releaseDateTime && new Date(item.releaseDateTime) > now)
      .sort((a, b) => new Date(a.releaseDateTime) - new Date(b.releaseDateTime))[0] || null;

    res.json({
      success: true,
      stats: {
        totalPending,
        totalPrompts,
        totalEmails,
        totalFunnels,
        thisWeekReleases,
        nextRelease
      },
      data: combined
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const scheduleContent = async (req, res) => {
  try {
    const { id, modelType, scheduledDate, scheduledTime, tier } = req.body;

    // Parse datetime WITHOUT forcing UTC ("Z")
    const releaseDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`);
    const now = new Date();

    const status = releaseDateTime <= now ? "active" : "scheduled";

    const models = { EmailSequence, PromptPack, FunnelTemplate };
    const Model = models[modelType];
    if (!Model) {
      return res.status(400).json({ success: false, message: "Invalid modelType" });
    }

    const updatedDoc = await Model.findByIdAndUpdate(
      id,
      {
        releaseDateTime,
        scheduledDate,
        scheduledTime,
        status,
        ...(tier && { tier })
      },
      { new: true, runValidators: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }

    res.json({
      success: true,
      message: "Content scheduled successfully",
      data: updatedDoc,
    });
  } catch (error) {
    console.error("Error scheduling content:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// UPDATE Scheduled Content
export const updateSchedule = async (req, res) => {
  try {
    const { id, modelType, scheduledDate, scheduledTime, status, tier } = req.body;

    const models = {
      EmailSequence,
      PromptPack,
      FunnelTemplate,
    };
    const Model = models[modelType];
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid modelType",
      });
    }

    let updateData = {};

    if (scheduledDate && scheduledTime) {
      const releaseDateTime = new Date(`${scheduledDate}T${scheduledTime}:00Z`);
      const now = new Date();
      updateData.releaseDateTime = releaseDateTime;
      updateData.scheduledDate = scheduledDate;
      updateData.scheduledTime = scheduledTime;

      // Auto set status if release time is already passed
      updateData.status = releaseDateTime <= now ? "active" : "scheduled";
    }

    if (status) updateData.status = status;
    if (tier) updateData.tier = tier; // allow tier updates

    const updatedDoc = await Model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.json({
      success: true,
      message: "Schedule updated successfully",
      data: updatedDoc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE Scheduled Content
export const deleteSchedule = async (req, res) => {
  try {
    const { id, modelType } = req.body;

    const models = {
      EmailSequence,
      PromptPack,
      FunnelTemplate,
    };
    const Model = models[modelType];
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid modelType",
      });
    }

    const deletedDoc = await Model.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.json({
      success: true,
      message: "Scheduled content deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getScheduledStats = async (req, res) => {
  try {
    await updateStatuses(); // update before calculating

    const [emails, prompts, funnels] = await Promise.all([
      EmailSequence.find({ status: "scheduled" }).lean(),
      PromptPack.find({ status: "scheduled" }).lean(),
      FunnelTemplate.find({ status: "scheduled" }).lean(),
    ]);

    const combined = [...emails, ...prompts, ...funnels];

    const now = new Date();

    // Week boundaries (Sunday → Saturday)
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Month boundaries
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Upcoming (next 30 days)
    const upcomingLimit = new Date(now);
    upcomingLimit.setDate(now.getDate() + 30);

    // Normalize scheduled field (always use releaseDateTime if available)
    const scheduledItems = combined
      .map((item) => ({
        id: item._id.toString(),
        content: item.title || item.name || item.quiz_title || "Untitled",
        type:
          item.sequenceType ||
          (item.promptText ? "Prompt Pack" : "Email Sequence") ||
          "Funnel Template",
        releaseDateTime: item.releaseDateTime || item.scheduledDate, // FIX
        tier: item.tier || "basic",
        status: item.status,
      }))
      .filter((i) => i.releaseDateTime);

    // Counts
    const upcomingCount = scheduledItems.filter((i) => {
      const d = new Date(i.releaseDateTime);
      return d >= now && d <= upcomingLimit;
    }).length;

    const thisWeekCount = scheduledItems.filter((i) => {
      const d = new Date(i.releaseDateTime);
      return d >= startOfWeek && d <= endOfWeek;
    }).length;

    const thisMonthCount = scheduledItems.filter((i) => {
      const d = new Date(i.releaseDateTime);
      return d >= startOfMonth && d <= endOfMonth;
    }).length;

    const overdueCount = scheduledItems.filter((i) => {
      const d = new Date(i.releaseDateTime);
      return d < now;
    }).length;

    // Find next release (closest upcoming date after now)
    const nextRelease = scheduledItems
      .filter((i) => new Date(i.releaseDateTime) >= now)
      .sort((a, b) => new Date(a.releaseDateTime) - new Date(b.releaseDateTime))[0] || null;

    res.json({
      success: true,
      stats: {
        totalPending: scheduledItems.length,
        totalPrompts: prompts.length,
        totalEmails: emails.length,
        totalFunnels: funnels.length,
        thisWeekReleases: thisWeekCount,
        thisMonthReleases: thisMonthCount,
        upcoming: upcomingCount,
        overdue: overdueCount,
        nextRelease,
      },
      data: scheduledItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const getAllScheduledWithoutRelease = async (req, res) => {
  try {
    const filter = {
      $or: [{ releaseDateTime: { $exists: false } }, { releaseDateTime: null }],
      status: "scheduled",
    };

    const [funnels, emailSequences, promptPacks] = await Promise.all([
      FunnelTemplate.find(filter),
      EmailSequence.find(filter),
      PromptPack.find(filter),
    ]);

    res.json({
      funnels,
      emailSequences,
      promptPacks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
