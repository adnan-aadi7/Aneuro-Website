import EmailSequence from "../model/EmailSequence.js";
import { uploadToCloudinary } from "../middleware/uploadToCloudinary.js";
import { logAction } from "../config/logAction.js";

export async function create(req, res) {
  try {
    const {
      name, emailCount, emails, tier, status, type, manualContent, emailTemplate
    } = req.body;

    let fileUrl = req.body.fileUrl;

    if (!name || !tier || !type) {
      return res.status(400).json({
        success: false,
        message: 'Name, tier, and type are required'
      });
    }

    if (type === 'file') {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: 'File is required' });
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer);
      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload file to Cloudinary'
        });
      }

      fileUrl = uploadResult.secure_url;
    }

    if (type === 'manual' && !manualContent) {
      return res.status(400).json({ success: false, message: 'Manual content required' });
    }

    let parsedTemplate = { subject: '', body: '', footer: '' };
    try {
      if (emailTemplate) parsedTemplate = JSON.parse(emailTemplate);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid emailTemplate JSON' });
    }

    const newSequence = new EmailSequence({
      name,
      emailCount: Number(emailCount) || 0,
      emails: Number(emails) || 0,
      tier,
      status: status || 'scheduled',
      type,
      fileUrl,
      manualContent,
      emailTemplate: parsedTemplate
    });

    const savedSequence = await newSequence.save();

    // ✅ Log this action
 await logAction({
      action: "CREATE", // must match your schema enum
      user: {
        id: req.user?._id || null,
        email: req.user?.email || "guest",
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "unknown"
      },
      affectedAsset: savedSequence._id,
      contentType: "email-sequence",
      details: `Created email sequence: ${savedSequence.name}`
    });
    res.status(201).json({
      success: true,
      message: 'Email sequence created successfully',
      data: savedSequence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating email sequence',
      error: error.message
    });
  }
}


// GET ALL
export async function getAll(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      tier,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    const filter = {};
    if (tier) filter.tier = tier;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sequences = await EmailSequence.find(filter)
      .populate('usage.users', 'name email')
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await EmailSequence.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: sequences,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      filters: { tier, status, search },
      sorting: { sortBy, sortOrder }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching email sequences',
      error: error.message
    });
  }
}

// GET BY ID
export async function getById(req, res) {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const sequence = await EmailSequence.findById(id).populate('usage.users', 'name email');

    if (!sequence) {
      return res.status(404).json({ success: false, message: 'Email sequence not found' });
    }

    res.status(200).json({ success: true, data: sequence });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching email sequence',
      error: error.message
    });
  }
}

// UPDATE
// UPDATE
export async function update(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    delete updateData.usage;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData._id;

    if (updateData.type === 'file' && !updateData.fileUrl) {
      return res.status(400).json({ success: false, message: 'File URL is required' });
    }

    if (updateData.type === 'manual' && !updateData.manualContent) {
      return res.status(400).json({ success: false, message: 'Manual content required' });
    }

    // Ensure emailTemplate fields exist or set to default
    updateData.emailTemplate = {
      subject: updateData?.emailTemplate?.subject || '',
      body: updateData?.emailTemplate?.body || '',
      footer: updateData?.emailTemplate?.footer || ''
    };

    const updatedSequence = await EmailSequence.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('usage.users', 'name email');

    if (!updatedSequence) {
      return res.status(404).json({ success: false, message: 'Email sequence not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Email sequence updated successfully',
      data: updatedSequence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating email sequence',
      error: error.message
    });
  }
}

// DELETE
export async function deleteSequence(req, res) {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const deletedSequence = await EmailSequence.findByIdAndDelete(id);

    if (!deletedSequence) {
      return res.status(404).json({ success: false, message: 'Email sequence not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Email sequence deleted successfully',
      data: {
        deletedId: id,
        deletedName: deletedSequence.name
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting email sequence',
      error: error.message
    });
  }
}

// BULK DELETE
export async function bulkDelete(req, res) {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'IDs array is required' });
    }

    const invalidIds = ids.filter(id => !id.match(/^[0-9a-fA-F]{24}$/));
    if (invalidIds.length > 0) {
      return res.status(400).json({ success: false, message: `Invalid IDs: ${invalidIds.join(', ')}` });
    }

    const result = await EmailSequence.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} email sequences deleted successfully`,
      data: { deletedCount: result.deletedCount, requestedCount: ids.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting email sequences',
      error: error.message
    });
  }
}


export async function getStats(req, res) {
  try {
    const mainStats = await EmailSequence.aggregate([
      {
        $group: {
          _id: null,
          totalSequences: { $sum: 1 },
          totalEmails: { $sum: "$emailCount" },
          totalOpens: { $sum: "$opens" },
          totalClicks: { $sum: "$clicks" },
          totalUsage: { $sum: "$usage.count" },
          averageRating: { $avg: "$rating" }
        }
      }
    ]);

    const totalActive = await EmailSequence.countDocuments({ status: "active" });
    const totalScheduled = await EmailSequence.countDocuments({ status: "scheduled" });

    // 🔹 Count by tier/category
    const categoryStats = await EmailSequence.aggregate([
      {
        $group: {
          _id: "$tier", // Group by category (tier)
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSequences: mainStats[0]?.totalSequences || 0,
        totalEmails: mainStats[0]?.totalEmails || 0,
        totalOpens: mainStats[0]?.totalOpens || 0,
        totalClicks: mainStats[0]?.totalClicks || 0,
        totalUsage: mainStats[0]?.totalUsage || 0,
        totalActive,
        totalScheduled,
        averageRating: mainStats[0]?.averageRating || 0,
        categoryCounts: categoryStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching email sequence statistics",
      error: error.message
    });
  }
}

