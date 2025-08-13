import FunnelTemplate from '../model/FunnelTemplate.js';
import { uploadToCloudinary } from '../middleware/uploadToCloudinary.js';
import path from 'path';

// ✅ Create Funnel Template with file upload
export const createFunnelTemplateWithFile = async (req, res) => {
  try {
    const { name, tier } = req.body;

    if (!name || !tier) {
      return res.status(400).json({
        success: false,
        message: 'Name and tier are required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const allowedExtensions = ['.pdf', '.docx', '.md', '.html'];
    const ext = path.extname(req.file.originalname.toLowerCase());

    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ success: false, message: 'Unsupported file type' });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, 'funnel_templates');

    if (!uploadResult?.secure_url) {
      return res.status(500).json({ success: false, message: 'File upload failed' });
    }

    const newTemplate = new FunnelTemplate({
      name,
      tier,
      fileUrl: uploadResult.secure_url,
      content: uploadResult.secure_url, // store URL in content as well
      status: 'scheduled',
    });

    await newTemplate.save();

    res.status(201).json({
      success: true,
      message: 'Funnel Template created successfully',
      data: newTemplate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Create Funnel Template with direct content
export const createFunnelTemplate = async (req, res) => {
  try {
    const { name, pages, category, tier, status, brainType, usage, conversions, content, fileUrl, userRating, releaseDateTime } = req.body;

    if (!name || !tier) {
      return res.status(400).json({ success: false, message: 'Name and tier are required' });
    }

    const allowedBrainTypes = ['Architect', 'Challenger', 'Synthesizer', 'Reflector', 'Catalyst'];
    if (brainType && !allowedBrainTypes.includes(brainType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid brainType. Allowed values: ${allowedBrainTypes.join(', ')}`,
      });
    }

    const newTemplate = new FunnelTemplate({
      name,
      pages,
      category,
      tier,
      status: status || 'scheduled',
      brainType,
      usage,
      conversions,
      content: content || fileUrl || '', // prefer content, fallback to fileUrl
      fileUrl: fileUrl || '',
      userRating,
      releaseDateTime: releaseDateTime ? new Date(releaseDateTime) : new Date(),
    });

    await newTemplate.save();

    res.status(201).json({
      success: true,
      message: 'Funnel Template created successfully',
      data: newTemplate,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get all Funnel Templates
export const getAllFunnelTemplates = async (req, res) => {
  try {
    const templates = await FunnelTemplate.find();
    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    res.status(200).json({ success: true, data: updatedTemplate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete Funnel Template
export const deleteFunnelTemplate = async (req, res) => {
  try {
    const deleted = await FunnelTemplate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Template not found' });

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Funnel Template statistics
export const getFunnelTemplateStats = async (req, res) => {
  try {
    const mainStats = await FunnelTemplate.aggregate([
      { $group: {
          _id: null,
          totalTemplates: { $sum: 1 },
          totalUsage: { $sum: "$usage" },
          totalConversions: { $sum: "$conversions" },
          averageUserRating: { $avg: "$userRating" }
      }}
    ]);

    const totalActive = await FunnelTemplate.countDocuments({ status: "active" });
    const totalScheduled = await FunnelTemplate.countDocuments({ status: "scheduled" });

    const tierStats = await FunnelTemplate.aggregate([
      { $group: { _id: "$tier", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTemplates: mainStats[0]?.totalTemplates || 0,
        totalUsage: mainStats[0]?.totalUsage || 0,
        totalConversions: mainStats[0]?.totalConversions || 0,
        averageUserRating: mainStats[0]?.averageUserRating || 0,
        totalActive,
        totalScheduled,
        tierCounts: tierStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching funnel template statistics", error: error.message });
  }
};
