import { Event } from '../models/Event.js';
import { Achievement } from '../models/User.js';
import { Gallery } from '../models/Gallery.js';

export const getAdminStats = async (req, res) => {
  try {
    // Get total counts
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({
      startDate: { $gt: new Date() }
    });
    const totalAchievements = await Achievement.countDocuments();
    const totalGalleryItems = await Gallery.countDocuments();

    // Get achievements by level
    const achievementsByLevel = await Achievement.aggregate([
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get achievements by sport
    const achievementsBySport = await Achievement.aggregate([
      {
        $group: {
          _id: "$sportType",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent achievements
    const recentAchievements = await Achievement.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get upcoming events
    const nextEvents = await Event.find({
      startDate: { $gt: new Date() }
    })
      .sort({ startDate: 1 })
      .limit(5);

    res.json({
      totalEvents,
      upcomingEvents,
      totalAchievements,
      totalGalleryItems,
      achievementsByLevel,
      achievementsBySport,
      recentAchievements,
      nextEvents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};