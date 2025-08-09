import FunnelTemplate from '../model/FunnelTemplate.js'
// CREATE new funnel template
export const createFunnelTemplate = async (req, res) => {
  try {
    const newTemplate = new FunnelTemplate(req.body);
    await newTemplate.save();
    res.status(201).json({ success: true, data: newTemplate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET all funnel templates
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
