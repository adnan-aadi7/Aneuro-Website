import Customization from '../model/Customization.js';
import { uploadToCloudinary } from '../middleware/uploadToCloudinary.js';

export const createOrUpdateCustomization = async (req, res) => {
    try {
        const { userId, primaryColor, secondaryColor, textColor, borderColor } = req.body;
        let logoVariant = null;

        // If file exists, upload to Cloudinary
        if (req.file) {
            const cloudinaryResponse = await uploadToCloudinary(req.file.buffer, 'customization_logos');
            logoVariant = { url: cloudinaryResponse.secure_url };
        }

        // Find customization by userId
        let customization = await Customization.findOne({ userId });

        if (customization) {
            // Replace the old logo URL with the new one if logoVariant exists
            if (logoVariant) {
                // Replace the entire array with new logo
                customization.logoVariants = [logoVariant];
            }

            if (primaryColor) customization.primaryColor = primaryColor;
            if (secondaryColor) customization.secondaryColor = secondaryColor;
            if (textColor) customization.textColor = textColor;
            if (borderColor) customization.borderColor = borderColor;
            customization.updatedAt = new Date();

            await customization.save();
        } else {
            customization = await Customization.create({
                userId,
                logoVariants: logoVariant ? [logoVariant] : [],
                primaryColor,
                secondaryColor,
                textColor,
                borderColor
            });
        }

        res.status(200).json({ success: true, data: customization });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get customization by userId
export const getMyCustomization  = async (req, res) => {
    try {
        const customization = await Customization.findOne({ userId: req.params.userId });
        if (!customization) {
            return res.status(404).json({ success: false, message: 'Customization not found' });
        }
        res.status(200).json({ success: true, data: customization });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
