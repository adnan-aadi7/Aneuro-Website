import PromptPack from '../model/Promptpack.js';
import { uploadToCloudinary } from '../middleware/uploadToCloudinary.js';
import path from 'path';
import { logAction } from "../config/logAction.js";
import Notification from "../model/Notification.js";

export const uploadPromptPack = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let { name, category, tier, status, type, releaseDateTime } = req.body;

    // Normalize tier input
    if (typeof tier === "string") {
      try {
        tier = JSON.parse(tier); // handles JSON string from form-data
      } catch {
        tier = [tier]; // fallback if just a plain string
      }
    }

    if (!Array.isArray(tier) || tier.length === 0) {
      return res.status(400).json({ success: false, message: 'Tier must be an array of 1–3 values' });
    }

    // File upload logic
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    const fileUrl = cloudinaryResult?.secure_url;
    if (!fileUrl) {
      return res.status(500).json({ success: false, message: 'Failed to upload file' });
    }

    const filename = req.file.originalname.toLowerCase();
    const allowedExtensions = ['.pdf', '.docx', '.md', '.html'];
    const ext = path.extname(filename);

    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ success: false, message: 'Unsupported file type' });
    }

    // Save to MongoDB
    const newPack = new PromptPack({
      name,
      category,
      tier, // ✅ now an array
      status,
      fileUrl,
      releaseDateTime: releaseDateTime ? new Date(releaseDateTime) : null, 
      prompts: [
        {
          content: fileUrl,
          type: type || 'Architect',
        },
      ],
    });

    const savedPack = await newPack.save();

    // Log + notify
    await logAction({
      action: "UPLOAD",
      user: { id: req.user?.id, email: req.user?.email },
      affectedAsset: savedPack.name,
      contentType: "prompt-pack",
      description: "Uploaded new prompt pack",
      req
    });

    if (savedPack.status === "active") {
      const notification = new Notification({
        title: ` ${name}`,
        message: `A new ${tier.join(", ")} tier prompt pack has been uploaded in category: ${category}`,
        type: "newtool",
        isPublic: true,
        targetTier: tier,
      });
      await notification.save();
    }

    res.status(201).json({
      success: true,
      message: 'Prompt pack uploaded successfully',
      data: savedPack,
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export async function create(req, res) {
  try {
    let { name, category, tier, status, prompts, releaseDateTime } = req.body;

    if (!name || !category || !tier || !status) {
      return res.status(400).json({
        success: false,
        message: "Name, category, tier, and status are required",
      });
    }

    // 🔑 Ensure tier is an array
    if (!Array.isArray(tier)) {
      tier = [tier]; // wrap single value into array
    }

    const newPromptPack = new PromptPack({
      name,
      category,
      tier,
      status,
      prompts: prompts || [],
      releaseDateTime: releaseDateTime ? new Date(releaseDateTime) : null,
    });

    const savedPromptPack = await newPromptPack.save();

    await logAction({
      action: "UPLOAD",
      user: {
        id: req.user?.id,
        email: req.user?.email,
      },
      affectedAsset: savedPromptPack.name,
      contentType: "prompt-pack",
      description: "Created new prompt pack",
      req,
    });

    // 🔔 notification per tier
    if (savedPromptPack.status === "active") {
      for (const t of savedPromptPack.tier) {
        const notification = new Notification({
          title: `${name}`,
          message: `A new ${t} tier prompt pack has been uploaded in category: ${category}`,
          type: "newtool",
          isPublic: true,
          targetTier: t,
        });
        await notification.save();
        console.log("Prompt Pack notification saved:", notification);
      }
    }

    res.status(201).json({
      success: true,
      message: "Prompt pack created successfully",
      data: savedPromptPack,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating prompt pack",
      error: error.message,
    });
  }
}




// GET ALL - Get all prompt packs with filtering, sorting, and pagination
export async function getAll(req, res) {
  try {
    const {
      page = 1,
      limit = 10000000,
      category,
      tier,
      status,
      sortBy = 'createdDate',
      sortOrder = 'desc',
      search,
      minUsage,
      maxUsage
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (tier) filter.tier = tier;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: 'i' };
    
    // Usage count filtering
    if (minUsage || maxUsage) {
      filter.usageCount = {};
      if (minUsage) filter.usageCount.$gte = parseInt(minUsage);
      if (maxUsage) filter.usageCount.$lte = parseInt(maxUsage);
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const promptPacks = await PromptPack.find(filter)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await PromptPack.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: promptPacks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      filters: { category, tier, status, search, minUsage, maxUsage },
      sorting: { sortBy, sortOrder }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prompt packs',
      error: error.message
    });
  }
}

// GET BY ID - Get single prompt pack
export async function getById(req, res) {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    const promptPack = await PromptPack.findById(id);

    if (!promptPack) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prompt pack not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: promptPack 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prompt pack',
      error: error.message
    });
  }
}

export const getGroupedPromptsByTier = async (req, res) => {
  try {
    const { tier, category } = req.query;

    if (!tier) {
      return res.status(400).json({
        success: false,
        message: "Tier query parameter is required",
      });
    }

    // Build filter object
    const filter = { tier };
    if (category) {
      filter.category = category;
    }

    // Find prompt packs
    const promptPacks = await PromptPack.find(filter);

    // Initialize grouped structure
    const grouped = {
      Architect: [],
      Challenger: [],
      Synthesizer: [],
      Reflector: [],
      Catalyst: [],
    };

    if (promptPacks && promptPacks.length > 0) {
      promptPacks.forEach((pack) => {
        if (pack.prompts && pack.prompts.length > 0) {
          pack.prompts.forEach((prompt) => {
            if (grouped[prompt.type]) {
              grouped[prompt.type].push({
                promptId: prompt._id,   // ✅ add promptId
                packId: pack._id,       // ✅ add packId
                content: prompt.content,
                type: prompt.type,
                packName: pack.name,
                category: pack.category,
              });
            }
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      tier,
      category: category || null,
      message:
        promptPacks.length === 0
          ? "No prompt packs found for this filter"
          : "Prompts fetched successfully",
      data: grouped,
    });
  } catch (error) {
    console.error("Error fetching grouped prompts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



// UPDATE - Update prompt pack
export async function update(req, res) {
  let updatedPromptPack = null; 
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    delete updateData.usageCount;
    delete updateData.createdDate;
    delete updateData._id;

    if (updateData.prompts && !Array.isArray(updateData.prompts)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompts must be an array' 
      });
    }

    updatedPromptPack = await PromptPack.findByIdAndUpdate(
      id, 
      updateData, 
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedPromptPack) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prompt pack not found' 
      });
    }

    await logAction({
      action: "EDIT",
      user: {
        id: req.user?.id,
        email: req.user?.email
      },
      affectedAsset: updatedPromptPack.name,
      contentType: "prompt-pack",
      description: "Updated prompt pack",
      req
    });

    res.status(200).json({
      success: true,
      message: 'Prompt pack updated successfully',
      data: updatedPromptPack
    });
  } catch (error) {
    // Log failed update attempt
    await logAction({
      action: "UPDATE_FAILED",
      user: {
        id: req.user?.id,
        email: req.user?.email
      },
      affectedAsset: updatedPromptPack?.name || "Unknown",
      contentType: "prompt-pack",
      description: `Failed to update prompt pack: ${error.message}`,
      req
    });

    res.status(500).json({
      success: false,
      message: 'Error updating prompt pack',
      error: error.message
    });
  }
}


export async function deletePromptPack(req, res) {
  let deletedPromptPack = null; 
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    deletedPromptPack = await PromptPack.findByIdAndDelete(id);

    if (!deletedPromptPack) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prompt pack not found' 
      });
    }

    await logAction({
      action: "DELETE",
      user: {
        id: req.user?.id,
        email: req.user?.email
      },
      affectedAsset: deletedPromptPack.name,
      contentType: "prompt-pack",
      description: "Deleted prompt pack",
      req
    });

    res.status(200).json({
      success: true,
      message: 'Prompt pack deleted successfully',
      data: {
        deletedId: id,
        deletedName: deletedPromptPack.name
      }
    });
  } catch (error) {
    await logAction({
      action: "DELETE_FAILED",
      user: {
        id: req.user?.id,
        email: req.user?.email
      },
      affectedAsset: deletedPromptPack?.name || "Unknown",
      contentType: "prompt-pack",
      description: `Failed to delete prompt pack: ${error.message}`,
      req
    });

    res.status(500).json({
      success: false,
      message: 'Error deleting prompt pack',
      error: error.message
    });
  }
}




// REMOVE PROMPT - Remove specific prompt from pack
export async function removePrompt(req, res) {
  try {
    const { id, promptId } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    const promptPack = await PromptPack.findById(id);
    if (!promptPack) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prompt pack not found' 
      });
    }

    promptPack.prompts = promptPack.prompts.filter(
      prompt => prompt._id.toString() !== promptId
    );

    const updatedPromptPack = await promptPack.save();

    res.status(200).json({
      success: true,
      message: 'Prompt removed successfully',
      data: updatedPromptPack
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing prompt',
      error: error.message
    });
  }
}

// INCREMENT USAGE - Increment usage count
export async function incrementUsage(req, res) {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    const updatedPromptPack = await PromptPack.findByIdAndUpdate(
      id,
      { $inc: { usageCount: 1 } },
      { new: true }
    );

    if (!updatedPromptPack) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prompt pack not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usage count updated',
      data: updatedPromptPack
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating usage count',
      error: error.message
    });
  }
}

// GET STATISTICS - Get usage statistics
export async function getStatistics(req, res) {
  try {
    // Overall statistics
    const stats = await PromptPack.aggregate([
      {
        $group: {
          _id: null,
          totalPacks: { $sum: 1 },
          totalUsage: { $sum: "$usageCount" },
          avgUsage: { $avg: "$usageCount" },
          maxUsage: { $max: "$usageCount" },
          minUsage: { $min: "$usageCount" },
          avgRating: { $avg: "$rating" } // overall avg rating
        }
      }
    ]);

    // Category statistics
    const categoryStats = await PromptPack.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalUsage: { $sum: "$usageCount" }
        }
      }
    ]);

    // Tier statistics
    const tierStats = await PromptPack.aggregate([
      {
        $group: {
          _id: "$tier",
          count: { $sum: 1 },
          totalUsage: { $sum: "$usageCount" }
        }
      }
    ]);

    // Status statistics (Active / Scheduled) + prompts count + avg rating
    const statusStats = await PromptPack.aggregate([
      {
        $group: {
          _id: "$status",
          totalPromptPacks: { $sum: 1 },
          totalPrompts: { $sum: { $size: "$prompts" } }, // counts prompts array length
          avgRating: { $avg: "$rating" },
          totalUsage: { $sum: "$usageCount" }
        }
      }
    ]);

    const activeStats = statusStats.find(s => s._id === "active") || {
      totalPromptPacks: 0,
      totalPrompts: 0,
      avgRating: 0
    };

    const scheduledStats = statusStats.find(s => s._id === "scheduled") || {
      totalPromptPacks: 0,
      totalPrompts: 0,
      avgRating: 0
    };

    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || {},
        byCategory: categoryStats,
        byTier: tierStats,
        status: {
          active: {
            totalPacks: activeStats.totalPromptPacks,
            totalPrompts: activeStats.totalPrompts,
            avgRating: activeStats.avgRating
          },
          scheduled: {
            totalPacks: scheduledStats.totalPromptPacks,
            totalPrompts: scheduledStats.totalPrompts,
            avgRating: scheduledStats.avgRating
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
}


export const editPromptInPromptPack = async (req, res) => {
  try {
    const { packId, promptId } = req.params;
    const { content, type } = req.body;

    if (!content && !type) {
      return res.status(400).json({
        success: false,
        message: "At least one field (content or type) must be provided to update.",
      });
    }

    const updatedPromptPack = await PromptPack.findOneAndUpdate(
      { _id: packId, "prompts._id": promptId },
      {
        $set: {
          ...(content && { "prompts.$.content": content }),
          ...(type && { "prompts.$.type": type }),
        },
      },
      { new: true }
    );

    if (!updatedPromptPack) {
      return res.status(404).json({
        success: false,
        message: "Prompt pack or prompt not found",
      });
    }

   await logAction({
      action: "EDIT",
      user: {
        id: req.user?.id,
        email: req.user?.email
      },
     affectedAsset: updatedPromptPack?.name || "Unknown PromptPack",
      contentType: "prompt-pack",
      description: `Prompt (ID: ${promptId}) updated in PromptPack: ${updatedPromptPack?.name}`,
      req,

    });

    res.status(200).json({
      success: true,
      message: "Prompt updated successfully",
      data: updatedPromptPack,
    });
  } catch (error) {
 
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update prompt",
    });
  }
};


export const ratePrompt = async (req, res) => {
  try {
    const { packId, promptId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const value = Number(rating);
    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const pack = await PromptPack.findById(packId);
    if (!pack) {
      return res.status(404).json({ error: "Prompt Pack not found" });
    }

    const prompt = pack.prompts.id(promptId);
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    // ✅ Check if user already rated
    const existingRating = prompt.ratings.find(
      (r) => r.user.toString() === userId
    );

    if (existingRating) {
      existingRating.value = value; // update rating
    } else {
      prompt.ratings.push({ user: userId, value });
    }

    // ✅ Recalculate average
    const total = prompt.ratings.reduce((sum, r) => sum + r.value, 0);
    prompt.averageRating = total / prompt.ratings.length;

    await pack.save();

    res.json({
      success: true,
      message: "Prompt rated successfully",
      averageRating: prompt.averageRating,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};