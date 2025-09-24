import EmailSequence from "../model/EmailSequence.js";
import { uploadToCloudinary } from "../middleware/uploadToCloudinary.js";
import { logAction } from "../config/logAction.js";
import Notification from "../model/Notification.js";

export async function create(req, res) {
  try {
    let {
      name,
      emails, 
      tier,
      status,
      type,
      brainType,
      releaseDateTime,
      category
    } = req.body;

    let fileUrl;

    // ✅ Validate required fields
    if (!name || !tier || !type || !brainType) {
      return res.status(400).json({
        success: false,
        message: 'Name, tier, type, and brainType are required'
      });
    }

    // ✅ Enum validation
// ✅ Enum validation
const allowedTiers = ['starter', 'growth', 'enterprise'];
const allowedTypes = ['manual', 'file'];
const allowedBrainTypes = ['Architect', 'Challenger', 'Synthesizer', 'Reflector', 'Catalyst'];

// ✅ Normalize tiers to array
let tierArray = Array.isArray(tier) ? tier : [tier];

// ✅ Validate tiers
for (let t of tierArray) {
  if (!allowedTiers.includes(t)) {
    return res.status(400).json({ success: false, message: `Invalid tier value: ${t}` });
  }
}

  
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid type value' });
    }
    if (!allowedBrainTypes.includes(brainType)) {
      return res.status(400).json({ success: false, message: 'Invalid brainType value' });
    }

    let emailArray = [];

    // ✅ File type handling
    if (type === 'file') {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: 'File is required for file type' });
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer);
      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload file to Cloudinary'
        });
      }

      fileUrl = uploadResult.secure_url;
      emailArray.push({ content: fileUrl, type: brainType });

    } else if (type === 'manual') {
      // ✅ Parse emails if it's a JSON string
      if (typeof emails === 'string') {
        try {
          emails = JSON.parse(emails);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: 'Invalid JSON format for emails'
          });
        }
      }

      if (!Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Emails array is required for manual type'
        });
      }

      emailArray = emails.map(email => ({
        content: email.content || '',
        type: email.type || brainType
      }));
    }

   if (!category) {
  return res.status(400).json({ success: false, message: 'Category is required' });
}

const newSequence = new EmailSequence({
  name,
  tier: tierArray,   // 👈 save array instead of single string
  category,
  releaseDateTime: releaseDateTime || null,
  status: status || 'scheduled',
  type,
  brainType,
  fileUrl,
  emails: emailArray,
  usage: { count: 0, users: [] }
});


    const savedSequence = await newSequence.save();

    // ✅ Log action
    await logAction({
      action: "UPLOAD",
      user: {
        id: req.user?.id,
        email: req.user?.email
      },
      affectedAsset: savedSequence.name,
      contentType: "email-sequence",
      description: "Created new email sequence",
      req
    });

if (savedSequence.status === "active") {
  for (const t of savedSequence.tier) {
    const notification = new Notification({
      title: `${name}`,
      message: `A new ${t} tier email sequence has been created in category: ${category}`,
      type: "newtool",
      isPublic: true,
      targetTier: t,
    });
    await notification.save();
  }
}


res.status(201).json({
  success: true,
  message: 'Email sequence created successfully (notification logged if active)',
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


export const getGroupedEmailsByTier = async (req, res) => {
  try {
    const { tier, category } = req.query;

    if (!tier) {
      return res
        .status(400)
        .json({ success: false, message: "Tier query parameter is required" });
    }

    // Build query dynamically (filter by tier and optional category)
    const query = { tier };
    if (category) {
      query.category = category;
    }

    // Find sequences for that tier (and category if provided)
    const sequences = await EmailSequence.find(query);

    // Initialize grouped structure
    const grouped = {
      Architect: [],
      Challenger: [],
      Synthesizer: [],
      Reflector: [],
      Catalyst: [],
    };

    if (sequences && sequences.length > 0) {
      // Go through each sequence and collect emails into the right array
      sequences.forEach((seq) => {
        if (seq.emails && seq.emails.length > 0) {
          seq.emails.forEach((email) => {
            if (grouped[email.type]) {
              // calculate average rating
              const ratings = email.ratings || [];
              const avgRating =
                ratings.length > 0
                  ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
                  : 0;

              grouped[email.type].push({
                ...email.toObject(),
                sequenceId: seq._id, // ✅ include sequenceId
                sequenceName: seq.name,
                category: seq.category,
                averageRating: avgRating,
              });
            }
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      tier,
      category: category || "all",
      message:
        sequences.length === 0
          ? "No email sequences found for this tier/category"
          : "Emails fetched successfully",
      data: grouped,
    });
  } catch (error) {
    console.error("Error fetching grouped emails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export async function getAll(req, res) {
  try {
    const {
      page = 1,
      limit = 100000,
      tier,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
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

    // ✅ Add usage stats (average opens, clicks, usage per user + total usage score)
    const enrichedSequences = sequences.map((seq) => {
      const totalUsers = seq.usage?.users?.length || 0;
      const totalEmails = seq.emails.length || 1;

      // Aggregate all email metrics
      const totalOpens = seq.emails.reduce((sum, email) => sum + (email.totalOpens || 0), 0);
      const totalClicks = seq.emails.reduce((sum, email) => sum + (email.uniqueClicks || 0), 0);

      // Average clicks per email
      const avgClicksPerEmail = totalEmails > 0 ? totalClicks / totalEmails : 0;

      return {
        ...seq.toObject(),
        usageStats: {
          totalUsage: seq.usage?.count || 0,
          totalUsers,
          totalEmails,
          totalOpens,
          totalClicks,
          avgUsagePerUser: totalUsers > 0 ? (seq.usage.count / totalUsers).toFixed(2) : 0,
          avgOpensPerUser: totalUsers > 0 ? (totalOpens / totalUsers).toFixed(2) : 0,
          avgClicksPerUser: totalUsers > 0 ? (totalClicks / totalUsers).toFixed(2) : 0,
          avgOpensPercent: seq.usage.count > 0 ? ((totalOpens / seq.usage.count) * 100).toFixed(2) + "%" : "0%",
          avgClicksPercent: seq.usage.count > 0 ? ((totalClicks / seq.usage.count) * 100).toFixed(2) + "%" : "0%",
          // ✅ New: Usage score based on avg clicks per email
          totalUsageBasedOnClicks: avgClicksPerEmail.toFixed(2),
        },
      };
    });

    const total = await EmailSequence.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: enrichedSequences,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
      filters: { tier, status, search },
      sorting: { sortBy, sortOrder },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching email sequences',
      error: error.message,
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

    // --- Calculate usage stats ---
    const usageStats = {
      totalUsage: sequence.usage?.count || 0,
      totalUsers: sequence.usage?.users?.length || 0,
      totalEmails: Array.isArray(sequence.emails) ? sequence.emails.length : 0,
      totalOpens: sequence.emails?.reduce((sum, e) => sum + (e.totalOpens || 0), 0) || 0,
      totalClicks: sequence.emails?.reduce((sum, e) => sum + (e.uniqueClicks || 0), 0) || 0,
    };

    // Percentages & averages
    usageStats.avgUsagePerUser = usageStats.totalUsers > 0 
      ? (usageStats.totalUsage / usageStats.totalUsers).toFixed(2) 
      : 0;

    usageStats.avgOpensPerUser = usageStats.totalUsers > 0 
      ? (usageStats.totalOpens / usageStats.totalUsers).toFixed(2) 
      : 0;

    usageStats.avgClicksPerUser = usageStats.totalUsers > 0 
      ? (usageStats.totalClicks / usageStats.totalUsers).toFixed(2) 
      : 0;

    usageStats.avgOpensPercent = usageStats.totalEmails > 0
      ? ((usageStats.totalOpens / usageStats.totalEmails) * 100).toFixed(2) + "%"
      : "0%";

    usageStats.avgClicksPercent = usageStats.totalEmails > 0
      ? ((usageStats.totalClicks / usageStats.totalEmails) * 100).toFixed(2) + "%"
      : "0%";

    usageStats.totalUsageBasedOnClicks = usageStats.totalEmails > 0
      ? (usageStats.totalClicks / usageStats.totalEmails).toFixed(2)
      : "0.00";

    // Attach stats
    const responseData = sequence.toObject();
    responseData.usageStats = usageStats;

    res.status(200).json({ success: true, data: responseData });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching email sequence',
      error: error.message
    });
  }
}


export async function update(req, res) {
  try {
    const { id } = req.params;
    let { name, tier, status, type, brainType, releaseDateTime, category, emails } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const existingSequence = await EmailSequence.findById(id);
    if (!existingSequence) {
      return res.status(404).json({ success: false, message: "Email sequence not found" });
    }

    // Keep existing emails
    let emailArray = existingSequence.emails || [];

    // Normalize tier(s) into array
    const allowedTiers = ["starter", "growth", "enterprise"];
    let tierArray = Array.isArray(tier) ? tier : tier ? [tier] : existingSequence.tier;

    // Validate tiers
    for (let t of tierArray) {
      if (!allowedTiers.includes(t)) {
        return res.status(400).json({ success: false, message: `Invalid tier value: ${t}` });
      }
    }

    // Handle new emails (avoid duplicates)
    if (emails) {
      if (typeof emails === "string") {
        try {
          emails = JSON.parse(emails);
        } catch (err) {
          return res.status(400).json({ success: false, message: "Invalid JSON format for emails" });
        }
      }

      if (Array.isArray(emails) && emails.length > 0) {
        const newEmails = emails.map((email) => ({
          content: email.content || "",
          type: email.type || brainType || existingSequence.brainType,
        }));

        // Filter out duplicates
        const existingContents = new Set(emailArray.map(e => e.content));
        const filteredEmails = newEmails.filter(e => !existingContents.has(e.content));

        emailArray = [...emailArray, ...filteredEmails]; // append only unique new emails
      }
    }

    const updatedSequence = await EmailSequence.findByIdAndUpdate(
      id,
      {
        name: name ?? existingSequence.name,
        tier: tierArray,
        status: status ?? existingSequence.status,
        category: category ?? existingSequence.category,
        type: type ?? existingSequence.type,
        brainType: brainType ?? existingSequence.brainType,
        releaseDateTime: releaseDateTime ?? existingSequence.releaseDateTime,
        emails: emailArray,
      },
      { new: true, runValidators: true }
    ).populate("usage.users", "name email");

    await logAction({
      action: "UPDATE",
      user: { id: req.user?.id, email: req.user?.email },
      affectedAsset: updatedSequence.name,
      contentType: "email-sequence",
      description: `Updated email sequence: ${updatedSequence.name}`,
      req,
    });

    res.status(200).json({
      success: true,
      message: "Email sequence updated successfully",
      data: updatedSequence,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating email sequence",
      error: error.message,
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

     await logAction({
      action: "DELETE",
      user: {
        id: req.user?.id,
        email: req.user?.email
      },
      affectedAsset: `${deletedSequence.name}`,
      contentType: "email-sequence",
      description: `Deleted email sequence: ${deletedSequence.name}`,
      req
    });

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


export async function getStats(req, res) {
  try {
    const mainStats = await EmailSequence.aggregate([
      { $unwind: { path: "$emails", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalSequences: { $addToSet: "$_id" },
          totalEmails: { $sum: 1 },
          totalOpens: { $sum: "$emails.totalOpens" },

          // ✅ Sum all clicks across all emails
          totalClicks: { $sum: "$emails.uniqueClicks" },

          // ✅ Treat clicks as usage
          totalUsage: { $sum: "$emails.uniqueClicks" },

          // ✅ Collect ratings for avg calculation
          allRatings: { $push: "$emails.ratings" }
        }
      },
      {
        $project: {
          totalSequences: { $size: "$totalSequences" },
          totalEmails: 1,
          totalOpens: 1,
          totalClicks: 1,
          totalUsage: 1,
          allRatings: {
            $reduce: {
              input: "$allRatings",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          },

          // ✅ Calculate averages
         avgClicks: {
  $cond: [
    { $gt: ["$totalEmails", 0] },
    { $multiply: [{ $divide: ["$totalClicks", "$totalEmails"] }, 100] },
    0
  ]
},
avgOpens: {
  $cond: [
    { $gt: ["$totalEmails", 0] },
    { $multiply: [{ $divide: ["$totalOpens", "$totalEmails"] }, 100] },
    0
  ]
}

        }
      },
      {
        $project: {
          totalSequences: 1,
          totalEmails: 1,
          totalOpens: 1,
          totalClicks: 1,
          totalUsage: 1,
          avgClicks: 1,
          avgOpens: 1,

          // ✅ Average rating across all ratings
          avgRating: {
            $cond: [
              { $gt: [{ $size: "$allRatings" }, 0] },
              { $avg: "$allRatings.value" },
              0
            ]
          }
        }
      }
    ]);

    const totalActive = await EmailSequence.countDocuments({ status: "active" });
    const totalScheduled = await EmailSequence.countDocuments({ status: "scheduled" });

    const categoryStats = await EmailSequence.aggregate([
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
        totalSequences: mainStats[0]?.totalSequences || 0,
        totalEmails: mainStats[0]?.totalEmails || 0,
        totalOpens: mainStats[0]?.totalOpens || 0,
        totalClicks: mainStats[0]?.totalClicks || 0,
        totalUsage: mainStats[0]?.totalUsage || 0, // ✅ usage = clicks
        avgClicks: mainStats[0]?.avgClicks || 0,
        avgOpens: mainStats[0]?.avgOpens || 0,
        avgRating: mainStats[0]?.avgRating || 0,
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
      message: "Error fetching email sequence statistics",
      error: error.message
    });
  }
}


export const trackEmailOpen = async (req, res) => {
  try {
    const { emailId } = req.params;

    // Find the sequence that contains this email
    const sequence = await EmailSequence.findOne({ "emails._id": emailId });
    if (!sequence) return res.status(404).send("Email not found in any sequence");

    const email = sequence.emails.id(emailId);
    if (!email) return res.status(404).send("Email not found");

    // Increment opens
    email.totalOpens = (email.totalOpens || 0) + 1;
    await sequence.save();

    // Return 1x1 transparent gif pixel
    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Content-Length": pixel.length,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    });
    res.end(pixel, "binary");
  } catch (error) {
    console.error("Error tracking email open:", error);
    res.status(500).send("Error tracking open");
  }
};

export const trackEmailClick = async (req, res) => {
  try {
    const { emailId } = req.params;
    const userId = req.user.id; 

    // Find sequence that contains this email
    const sequence = await EmailSequence.findOne({ "emails._id": emailId });
    if (!sequence) return res.status(404).json({ error: "Email not found" });

    const email = sequence.emails.id(emailId);
    if (!email) return res.status(404).json({ error: "Email not found" });

    // Initialize fields if missing
    if (!email.uniqueClicks) email.uniqueClicks = 0;
    if (!email.clickedUsers) email.clickedUsers = [];

    // Count only unique user click
    if (!email.clickedUsers.includes(userId)) {
      email.uniqueClicks += 1;
      email.clickedUsers.push(userId);
    }

    await sequence.save();

    res.status(200).json({
      message: "Click tracked successfully",
      emailId,
      uniqueClicks: email.uniqueClicks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editEmailInSequence = async (req, res) => {
  try {
    const { sequenceId, emailId } = req.params;
    const { content, type } = req.body;

    const sequence = await EmailSequence.findOne({
      _id: sequenceId,
      "emails._id": emailId,
    });

    if (!sequence) {
      return res.status(404).json({
        success: false,
        message: "Email sequence or email not found",
      });
    }

    // Locate the email inside array
    const email = sequence.emails.id(emailId);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found in the sequence",
      });
    }

    // Store old values for logging
    const oldContent = email.content;
    const oldType = email.type;

    // Update fields
    if (content) email.content = content;
    if (type) {
      const allowedTypes = ["Architect", "Challenger", "Synthesizer", "Reflector", "Catalyst"];
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid brain type",
        });
      }
      email.type = type;
    }

    await sequence.save();

    // ✅ Log EDIT action
    await logAction({
      action: "EDIT",
      user: {
        id: req.user?.id,
        email: req.user?.email,
      },
      affectedAsset: `${sequence.name}`,
      contentType: "email-sequence",
      description: `Edited email (${emailId}) in sequence: ${sequence.name}`,
      details: {
        oldContent,
        newContent: email.content,
        oldType,
        newType: email.type,
      },
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: email,
    });
  } catch (error) {
    console.error("Error editing email:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const deleteEmailInSequence = async (req, res) => {
  try {
    const { sequenceId, emailId } = req.params;

    // Try to pull the email from the array
    const updatedSequence = await EmailSequence.findOneAndUpdate(
      { _id: sequenceId },
      { $pull: { emails: { _id: emailId } } },
      { new: true }
    );

    if (!updatedSequence) {
      return res.status(404).json({
        success: false,
        message: "Email sequence or email not found",
      });
    }

    // Log the deletion
    await logAction({
      action: "DELETE",
      user: {
        id: req.user?.id,
        email: req.user?.email,
      },
      affectedAsset: `${updatedSequence.name}`,
      contentType: "email-sequence",
      description: `Deleted email with ID: ${emailId} from sequence: ${updatedSequence.name}`,
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Email deleted successfully",
      data: { emailId },
    });
  } catch (error) {
    console.error("Error deleting email:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const rateEmail = async (req, res) => {
  try {
    const { sequenceId, emailId } = req.params;
    const userId = req.user.id;

    // Accept either `rating` or `value`
    const rawValue = req.body.rating ?? req.body.value;
    const value = Number(rawValue);

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const sequence = await EmailSequence.findById(sequenceId);
    if (!sequence) {
      return res.status(404).json({ error: "Email sequence not found" });
    }

    const email = sequence.emails.id(emailId);
    if (!email) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Check if user already rated
    const existingRating = email.ratings.find(
      (r) => r.user.toString() === userId
    );

    if (existingRating) {
      existingRating.value = value;
    } else {
      email.ratings.push({ user: userId, value });
    }

    // ✅ Safe average calculation
    if (email.ratings.length > 0) {
      const total = email.ratings.reduce((sum, r) => sum + r.value, 0);
      email.averageRating = total / email.ratings.length;
    } else {
      email.averageRating = 0;
    }

    await sequence.save();

    res.json({
      success: true,
      message: "Rating submitted successfully",
      averageRating: email.averageRating,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};


