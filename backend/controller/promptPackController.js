import PromptPack from "../model/Promptpack.js";
import { uploadToCloudinary } from '../middleware/uploadToCloudinary.js'

import path from 'path';

export const uploadPromptPack = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!req.body.tier) {
      return res.status(400).json({ success: false, message: 'Tier is required' });
    }

    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    const fileUrl = cloudinaryResult?.secure_url;

    // Parse file content
    const fileContent = req.file.buffer.toString('utf8');
    let prompts = [];

    if (req.file.originalname.endsWith('.json')) {
      prompts = JSON.parse(fileContent);
    } else if (
      req.file.originalname.endsWith('.txt') ||
      req.file.originalname.endsWith('.md')
    ) {
      prompts = fileContent
        .split('\n')
        .filter(line => line.trim()) // remove empty lines
        .map(line => ({
          content: line.trim(),
          type: 'analytical', // default type
        }));
    }

    // Save to MongoDB
    const newPack = new PromptPack({
      name: path.parse(req.file.originalname).name, // filename without extension
      category: 'General', // default category
      tier: req.body.tier,
      status: 'scheduled', // default status
      prompts,
      fileUrl, // store the Cloudinary URL
    });

    const savedPack = await newPack.save();

    res.status(201).json({
      success: true,
      message: 'Prompt pack uploaded successfully',
      data: savedPack,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// CREATE - Create new prompt pack
export async function create(req, res) {
  try {
    const { name, category, tier, status, prompts } = req.body;

    // Validation
    if (!name || !category || !tier || !status) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, tier, and status are required'
      });
    }

    // Validate prompts array if provided
    if (prompts && Array.isArray(prompts)) {
      for (const prompt of prompts) {
        if (!prompt.content || !prompt.type) {
          return res.status(400).json({
            success: false,
            message: 'Each prompt must have content and type'
          });
        }
      }
    }

    const newPromptPack = new PromptPack({
      name,
      category,
      tier,
      status,
      prompts: prompts || []
    });

    const savedPromptPack = await newPromptPack.save();

    res.status(201).json({
      success: true,
      message: 'Prompt pack created successfully',
      data: savedPromptPack
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating prompt pack',
      error: error.message
    });
  }
}

// GET ALL - Get all prompt packs with filtering, sorting, and pagination
export async function getAll(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
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

// UPDATE - Update prompt pack
export async function update(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.usageCount;
    delete updateData.createdDate;
    delete updateData._id;

    // Validate prompts if being updated
    if (updateData.prompts && Array.isArray(updateData.prompts)) {
      for (const prompt of updateData.prompts) {
        if (!prompt.content || !prompt.type) {
          return res.status(400).json({
            success: false,
            message: 'Each prompt must have content and type'
          });
        }
      }
    }

    const updatedPromptPack = await PromptPack.findByIdAndUpdate(
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

    res.status(200).json({
      success: true,
      message: 'Prompt pack updated successfully',
      data: updatedPromptPack
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating prompt pack',
      error: error.message
    });
  }
}

// DELETE - Delete prompt pack
export async function deletePromptPack(req, res) {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    const deletedPromptPack = await PromptPack.findByIdAndDelete(id);

    if (!deletedPromptPack) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prompt pack not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prompt pack deleted successfully',
      data: {
        deletedId: id,
        deletedName: deletedPromptPack.name
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting prompt pack',
      error: error.message
    });
  }
}

// BULK DELETE - Delete multiple prompt packs
export async function bulkDelete(req, res) {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'IDs array is required' 
      });
    }

    const invalidIds = ids.filter(id => !id.match(/^[0-9a-fA-F]{24}$/));
    if (invalidIds.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid IDs: ${invalidIds.join(', ')}` 
      });
    }

    const result = await PromptPack.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} prompt packs deleted successfully`,
      data: { 
        deletedCount: result.deletedCount, 
        requestedCount: ids.length 
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting prompt packs',
      error: error.message
    });
  }
}

// ADD PROMPT - Add single prompt to pack
export async function addPrompt(req, res) {
  try {
    const { id } = req.params;
    const { content, type } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    if (!content || !type) {
      return res.status(400).json({
        success: false,
        message: 'Content and type are required'
      });
    }

    const promptPack = await PromptPack.findById(id);
    if (!promptPack) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prompt pack not found' 
      });
    }

    promptPack.prompts.push({ content, type });
    const updatedPromptPack = await promptPack.save();

    res.status(200).json({
      success: true,
      message: 'Prompt added successfully',
      data: updatedPromptPack
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding prompt',
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
