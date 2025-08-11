import FunnelTemplate from '../model/FunnelTemplate.js';
import { uploadToCloudinary } from '../middleware/uploadToCloudinary.js';

// Create new Funnel Template with file upload & tier
export const createFunnelTemplateWithFile = async (req, res) => {
  try {
    const { name, tier } = req.body; // Name & tier from request

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Upload file to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, 'funnel_templates');

    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({
        success: false,
        message: 'File upload failed',
      });
    }

    // Create new FunnelTemplate
    const newTemplate = new FunnelTemplate({
      name,
      tier,
      fileUrl: uploadResult.secure_url,
      status: 'scheduled', // optional default
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
// CREATE  funnel template
export const createFunnelTemplate = async (req, res) => {
  try {
    const newTemplate = new FunnelTemplate(req.body);
    await newTemplate.save();
    res.status(201).json({ success: true, data: newTemplate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getAllFunnelTemplates = async (req, res) => {
  try {
    const templates = await FunnelTemplate.find();
    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFunnelTemplateById = async (req, res) => {
  try {
    const template = await FunnelTemplate.findById(req.params.id); 
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.status(200).json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// UPDATE funnel template
export const updateFunnelTemplate = async (req, res) => {
  try {
    const updatedTemplate = await FunnelTemplate.findByIdAndUpdate(
     req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTemplate) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.status(200).json({ success: true, data: updatedTemplate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE funnel template
export const deleteFunnelTemplate = async (req, res) => {
  try {
    const deleted = await FunnelTemplate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
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
          totalUsage: { $sum: "$usage" },
          totalConversions: { $sum: "$conversions" },
          averageUserRating: { $avg: "$userRating" }
        }
      }
    ]);

    const totalActive = await FunnelTemplate.countDocuments({ status: "active" });
    const totalScheduled = await FunnelTemplate.countDocuments({ status: "scheduled" });

    // Breakdown by tier
    const categoryStats = await FunnelTemplate.aggregate([
      {
        $group: {
          _id: "$tier",
          count: { $sum: 1 }
        }
      }
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
        categoryCounts: categoryStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching funnel template statistics",
      error: error.message
    });
  }
};
