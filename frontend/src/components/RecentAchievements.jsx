import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  Avatar,
  Tooltip,
  Fade,
  Divider,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { EmojiEvents, SportsSoccer, MilitaryTech } from "@mui/icons-material";
import axios from "axios";

const RecentAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Fetch achievements data
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:4000/api/admin/achievements"
        );

        // Filter for current year achievements
        const currentYear = new Date().getFullYear();
        const recentAchievements = data.filter(
          (achievement) =>
            achievement.year === currentYear ||
            achievement.year === currentYear.toString()
        );

        setAchievements(recentAchievements);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Get medal icon and color based on position
  const getMedalInfo = (position) => {
    if (!position) return { color: theme.palette.primary.main, icon: null };

    const pos = position.toLowerCase();
    if (pos.includes("1") || pos.includes("first") || pos.includes("gold")) {
      return { color: "#FFD700", icon: <MilitaryTech fontSize="small" /> };
    } else if (
      pos.includes("2") ||
      pos.includes("second") ||
      pos.includes("silver")
    ) {
      return { color: "#C0C0C0", icon: <MilitaryTech fontSize="small" /> };
    } else if (
      pos.includes("3") ||
      pos.includes("third") ||
      pos.includes("bronze")
    ) {
      return { color: "#CD7F32", icon: <MilitaryTech fontSize="small" /> };
    }
    return { color: theme.palette.primary.main, icon: null };
  };

  // Get sport icon based on sport type
  const getSportIcon = (sport) => {
    switch (sport?.toLowerCase()) {
      case "cricket":
        return "🏏";
      case "basketball":
        return "🏀";
      case "football":
      case "soccer":
        return "⚽";
      case "volleyball":
        return "🏐";
      case "table tennis":
        return "🏓";
      case "chess":
        return "♟️";
      case "athletics":
        return "🏃";
      default:
        return "🏆";
    }
  };
  return (
    <Paper
      elevation={2}
      sx={{
        my: 2,
        py: 1,
        px: 2,
        borderRadius: 2,
        overflow: "hidden",
        maxHeight: "350px",
        background: theme.palette.background.paper,
      }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 1,
        }}>
        <EmojiEvents color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Recent Achievements
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : achievements.length > 0 ? (
        <Box
          sx={{
            maxHeight: "290px",
            overflowY: "auto",
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.primary.light,
              borderRadius: "4px",
            },
          }}>
          <Grid container spacing={1.5}>
            {achievements.map((achievement) => {
              const { color, icon } = getMedalInfo(achievement.position);
              return (
                <Grid item xs={12} sm={6} md={4} key={achievement._id}>
                  <Tooltip
                    title={`${achievement.participantName} - ${
                      achievement.sportType
                    } (${achievement.position || "Participated"})`}
                    arrow
                    placement="top"
                    TransitionComponent={Fade}
                    enterDelay={500}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        "&:hover": {
                          backgroundColor: (alpha) =>
                            theme.palette.action.hover,
                          boxShadow: 1,
                        },
                        transition: "all 0.2s ease",
                      }}>
                      <Avatar
                        sx={{
                          bgcolor: `${color}15`,
                          color,
                          width: 32,
                          height: 32,
                          mr: 1.5,
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                        }}>
                        {getSportIcon(achievement.sportType)}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="subtitle2"
                            noWrap
                            sx={{ fontWeight: 600, flex: 1 }}>
                            {achievement.participantName}
                          </Typography>

                          {icon && <Box sx={{ color, ml: 0.5 }}>{icon}</Box>}
                        </Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="div"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}>
                          <span>{achievement.sportType}</span>
                          {achievement.level && (
                            <>
                              <Box
                                component="span"
                                sx={{
                                  display: "inline-block",
                                  width: "3px",
                                  height: "3px",
                                  borderRadius: "50%",
                                  bgcolor: "text.disabled",
                                }}
                              />
                              <span>{achievement.level}</span>
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Tooltip>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ) : (
        <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
          No recent achievements found
        </Typography>
      )}
    </Paper>
  );
};

export default RecentAchievements;
