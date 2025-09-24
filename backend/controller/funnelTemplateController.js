import FunnelTemplate from '../model/FunnelTemplate.js';
import { uploadToCloudinary } from '../middleware/uploadToCloudinary.js';
import path from 'path';
import { logAction } from "../config/logAction.js";
import Notification from "../model/Notification.js";

export const createFunnelTemplateWithFile = async (req, res) => {
  try {
    const { name, tier, status, category, brainType } = req.body;

    // ✅ Normalize tier: always store as array
    let normalizedTier;
    if (Array.isArray(tier)) {
      normalizedTier = tier.filter(Boolean); // remove null/empty
    } else if (typeof tier === "string") {
      // if single value comes as comma-separated string
      normalizedTier = tier.split(",").map(t => t.trim()).filter(Boolean);
    } else {
      normalizedTier = [];
    }

    // Required fields validation
    if (!name || !normalizedTier.length) {
      return res.status(400).json({
        success: false,
        message: "Name and at least one tier are required",
      });
    }

    // ✅ enforce max 3 tiers
    if (normalizedTier.length > 3) {
      return res.status(400).json({
        success: false,
        message: "You can only assign up to 3 tiers",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Allowed file types
    const allowedExtensions = [".pdf", ".docx", ".md", ".html", ".txt"];
    const ext = path.extname(req.file.originalname.toLowerCase());
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }

    // Upload file to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "funnel_templates"
    );
    if (!uploadResult?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "File upload failed",
      });
    }

    // Create and save template
    const newTemplate = new FunnelTemplate({
      name,
      tier: normalizedTier,
      category: category || "",
      status: status || "scheduled",
      brainType: brainType || "",
      fileUrl: uploadResult.secure_url,
      content: uploadResult.secure_url,
    });

    const savedTemplate = await newTemplate.save();

    // Log action
    await logAction({
      action: "UPLOAD",
      user: { id: req.user?.id, email: req.user?.email },
      affectedAsset: savedTemplate.name,
      contentType: "funnel-template",
      description: "Created new funnel template with file",
      req,
    });

    // Send notification if active
    if (savedTemplate.status === "active") {
      const notification = new Notification({
        title: `${name}`,
        message: `A new ${normalizedTier.join(
          ", "
        )} tier funnel template has been created in category: ${
          category || "general"
        } ${
          brainType ? `for brain type: ${brainType}` : ""
        }`,
        type: "newtool",
        isPublic: true,
        targetTier: normalizedTier,
      });
      await notification.save();
      console.log("Funnel Template notification saved:", notification);
    }

    // Response
    res.status(201).json({
      success: true,
      message: "Funnel Template created successfully",
      data: savedTemplate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const createFunnelTemplate = async (req, res) => {
  try {
    const { 
      name, 
      pages, 
      category, 
      tier, // can be string or array
      status, 
      brainType, 
      usage, 
      conversions, 
      content, 
      fileUrl, 
      userRating, 
      releaseDateTime 
    } = req.body;

    if (!name || !tier || (Array.isArray(tier) && tier.length === 0)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and at least one tier are required' 
      });
    }

    // ✅ Normalize tier to array
    const tiersArray = Array.isArray(tier) ? tier : [tier];

    // ✅ Validate tiers against enum
    const allowedTiers = ["starter", "growth", "enterprise"];
    const invalidTiers = tiersArray.filter(t => !allowedTiers.includes(t));
    if (invalidTiers.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid tier(s): ${invalidTiers.join(", ")}. Allowed values: ${allowedTiers.join(", ")}`
      });
    }

    // ✅ Validate brainType
    const allowedBrainTypes = ['Architect', 'Challenger', 'Synthesizer', 'Reflector', 'Catalyst'];
    if (brainType && !allowedBrainTypes.includes(brainType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid brainType. Allowed values: ${allowedBrainTypes.join(', ')}`,
      });
    }

    // ✅ Save template
    const newTemplate = new FunnelTemplate({
      name,
      pages,
      category,
      tier: tiersArray,   // <-- store as array
      status: status || 'scheduled',
      brainType,
      usage,
      conversions,
      content: content || fileUrl || '', 
      fileUrl: fileUrl || '',
      userRating,
      releaseDateTime: releaseDateTime ? new Date(releaseDateTime) : null, 
    });

    const savedTemplate = await newTemplate.save();

    // ✅ Log action
    await logAction({
      action: "CREATE",
      user: { id: req.user?.id, email: req.user?.email },
      affectedAsset: savedTemplate.name,
      contentType: "funnel-template",
      description: "Created new funnel template",
      req
    });

    // ✅ Create notifications for each tier if active
    if (savedTemplate.status === 'active') {
      for (const t of tiersArray) {
        const notification = new Notification({
          title: savedTemplate.name,
          message: `A new ${t} tier funnel template has been created in category: ${category || 'general'}`,
          type: 'newtool',
          isPublic: true,
          targetTier: t,
        });
        await notification.save();
        console.log('Funnel Template notification saved for tier:', t);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Funnel Template created successfully',
      data: savedTemplate,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// ✅ Get all Funnel Templates
export const getAllFunnelTemplates = async (req, res) => {
  try {
    const templates = await FunnelTemplate.find()
      .sort({ createdAt: -1 })
      .lean(); // plain objects so we can safely add computed fields

    const enrichedTemplates = templates.map((tpl) => ({
      ...tpl,
      usage: tpl.clicks?.total || 0,           // ⭐ usage from clicks
      uniqueUsers: tpl.clicks?.users?.length || 0 // ⭐ unique users count
    }));

    res.status(200).json({ 
      success: true, 
      data: enrichedTemplates 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


// ✅ Get Funnel Template by ID
export const getFunnelTemplateById = async (req, res) => {
  try {
    const template = await FunnelTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

    res.status(200).json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Funnel Template
export const updateFunnelTemplate = async (req, res) => {

  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTemplate = await FunnelTemplate.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedTemplate) return res.status(404).json({ success: false, message: 'Template not found' });
    
    await logAction({
      action: "EDIT",
      user: { id: req.user?.id, email: req.user?.email },
      affectedAsset: updatedTemplate.name,
      contentType: "funnel-template",
      description: "Updated funnel template",
      req
    });

    res.status(200).json({ success: true, data: updatedTemplate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete Funnel Template
export const deleteFunnelTemplate = async (req, res) => {
  try {
    const deletedTemplate = await FunnelTemplate.findByIdAndDelete(req.params.id);

    if (!deletedTemplate) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    await logAction({
      action: "DELETE",
      user: { id: req.user?.id, email: req.user?.email },
      affectedAsset: deletedTemplate.name,
      contentType: "funnel-template",
      description: "Deleted funnel template",
      req
    });

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFunnelTemplateStats = async (req, res) => {
  try {
    const mainStats = await FunnelTemplate.aggregate([
      {
        $group: {
          _id: null,
          totalTemplates: { $sum: 1 },

          // ⭐ use clicks.total instead of usage
          totalUsage: { $sum: "$clicks.total" },
          avgUsage: { $avg: "$clicks.total" },

          totalConversions: { $sum: "$conversions" },

          avgConversionRate: {
            $avg: {
              $cond: [
                { $gt: ["$clicks.total", 0] }, // avoid divide by zero
                { $divide: ["$conversions", "$clicks.total"] },
                0,
              ],
            },
          },

          avgRating: { $avg: "$averageRating" },
        },
      },
    ]);

    const totalActive = await FunnelTemplate.countDocuments({ status: "active" });
    const totalScheduled = await FunnelTemplate.countDocuments({ status: "scheduled" });

    const tierStats = await FunnelTemplate.aggregate([
      { $unwind: "$tier" },
      { $group: { _id: "$tier", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTemplates: mainStats[0]?.totalTemplates || 0,
        totalUsage: mainStats[0]?.totalUsage || 0,
        avgUsage: mainStats[0]?.avgUsage || 0,
        totalConversions: mainStats[0]?.totalConversions || 0,

        // frontend multiply by 100 if you want percentage
        avgConversionRate: mainStats[0]?.avgConversionRate || 0,

        avgRating: mainStats[0]?.avgRating || 0,
        totalActive,
        totalScheduled,
        tierCounts: tierStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching funnel template statistics",
      error: error.message,
    });
  }
};



export const rateFunnel = async (req, res) => {
  try {
    const { funnelId } = req.params;
    const { rating } = req.body;
    const userId = req.user?.id; // <-- get userId from auth middleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (rating === undefined) {
      return res.status(400).json({ message: "Rating is required" });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    const funnel = await FunnelTemplate.findById(funnelId);
    if (!funnel) {
      return res.status(404).json({ message: "Funnel not found" });
    }

    // Assuming you have a method to add/update rating
    await funnel.addRating(userId, rating);

    return res.status(200).json({
      message: "Rating submitted successfully",
      averageRating: funnel.averageRating,
      ratingsCount: funnel.ratings.length,
    });

  } catch (error) {
    console.error("Error rating funnel:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export async function trackClick(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // ⬅️ Assuming user is from auth middleware

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const funnel = await FunnelTemplate.findById(id);
    if (!funnel) {
      return res.status(404).json({ success: false, message: "Funnel template not found" });
    }

    // Check if user already clicked
    const alreadyClicked = funnel.clicks.users.some(
      (u) => u.toString() === userId.toString()
    );

    if (!alreadyClicked) {
      funnel.clicks.users.push(userId);
      funnel.clicks.total += 1;
      await funnel.save();
    }

    res.status(200).json({
      success: true,
      message: alreadyClicked
        ? "User already counted for this template"
        : "Click recorded successfully",
      clicks: funnel.clicks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error tracking click",
      error: error.message
    });
  }
}
