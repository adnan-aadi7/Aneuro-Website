import Log from '../model/Log.js';

export const getLogs = async (req, res) => {
  try {
    const { action, user, timeRange, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (action) filter.action = action.toUpperCase();
    if (user) filter['user.email'] = user;

    if (timeRange && timeRange !== 'all_time') {
      let fromDate;
      if (timeRange === 'last_24h') fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (timeRange === 'last_7d') fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (timeRange === 'last_30d') fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (fromDate) filter.timestamp = { $gte: fromDate };
    }

    if (search) {
      filter.$or = [
        { contentType: { $regex: search, $options: 'i' } },
        { affectedAsset: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const logs = await Log.find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Log.countDocuments(filter);

    res.json({ total, page: parseInt(page), limit: parseInt(limit), logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
