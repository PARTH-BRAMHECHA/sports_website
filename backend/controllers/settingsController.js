import Settings from "../models/Settings.js";

// Get all settings
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    return res.status(200).json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const { registrationEnabled, googleCalendarId } = req.body;

    if (
      typeof registrationEnabled !== "undefined" &&
      typeof registrationEnabled !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration setting provided",
      });
    }

    const settings = await Settings.getSettings();

    if (typeof registrationEnabled !== "undefined") {
      settings.registrationEnabled = registrationEnabled;
    }

    if (typeof googleCalendarId !== "undefined") {
      settings.googleCalendarId = googleCalendarId;
    }

    settings.lastUpdated = new Date();
    settings.updatedBy = req.user._id;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: `Registration has been ${
        registrationEnabled ? "enabled" : "disabled"
      }`,
      data: settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

// Get registration status (public endpoint)
export const getRegistrationStatus = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    return res.status(200).json({
      registrationEnabled: settings.registrationEnabled,
    });
  } catch (error) {
    console.error("Get registration status error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

// Get calendar ID (public endpoint)
export const getCalendarId = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    return res.status(200).json({
      success: true,
      googleCalendarId: settings.googleCalendarId || "",
    });
  } catch (error) {
    console.error("Get calendar ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};
